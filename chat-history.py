#!/usr/bin/env python3
"""
KUANA Claude Chat History Viewer
Usage:
  python3 chat-history.py              # show all sessions
  python3 chat-history.py -s 1         # show only session 1
  python3 chat-history.py -k deploy    # filter messages containing "deploy"
  python3 chat-history.py -k deploy -s 2  # filter by keyword in session 2
"""

import os
import json
import sys
import argparse
from datetime import datetime

PROJECT_DIR = os.path.expanduser(
    '~/.claude/projects/-Users-kushanmaskey-Personal-Projects-workspace-Claude-kuana'
)

SKIP_PREFIXES = (
    '<system-reminder',
    '<local-command-caveat>',
    '<local-command-stdout>',
    '<command-name>',
    '<command-message>',
    '<command-args>',
    '<function_calls>',
    'This session is being continued from a previous conversation',
    'Summary:',
)

def extract_text(content):
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get('type') == 'text':
                parts.append(block.get('text', '').strip())
        return ' '.join(p for p in parts if p)
    return ''

def should_skip(text):
    if not text:
        return True
    for prefix in SKIP_PREFIXES:
        if text.startswith(prefix):
            return True
    return False

def load_sessions():
    sessions = []
    try:
        files = sorted([
            f for f in os.listdir(PROJECT_DIR)
            if f.endswith('.jsonl')
        ])
    except FileNotFoundError:
        print(f'Error: directory not found:\n  {PROJECT_DIR}')
        sys.exit(1)

    if not files:
        print('No session files found.')
        sys.exit(0)

    for fname in files:
        path = os.path.join(PROJECT_DIR, fname)
        stat = os.stat(path)
        session_date = datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M')
        messages = []
        with open(path, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue

                if obj.get('type') == 'user':
                    content = obj.get('message', {}).get('content', '')
                    text = extract_text(content)
                    if not should_skip(text):
                        ts = obj.get('timestamp', '')
                        try:
                            dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                            time_str = dt.strftime('%H:%M')
                        except Exception:
                            time_str = ''
                        messages.append({'time': time_str, 'text': text})

        sessions.append({
            'file': fname[:8],
            'date': session_date,
            'messages': messages,
        })

    return sessions

def print_session(idx, session, keyword=None, counter_start=1):
    date = session['date']
    fid = session['file']
    messages = session['messages']

    if keyword:
        messages = [m for m in messages if keyword.lower() in m['text'].lower()]

    if not messages:
        return counter_start

    width = 72
    print('\n' + '═' * width)
    print(f"  SESSION {idx}  •  {date}  •  ID: {fid}...")
    print('═' * width)

    n = counter_start
    for msg in messages:
        time_tag = f"[{msg['time']}] " if msg['time'] else ''
        header = f"  {n:>3}. {time_tag}"
        indent = ' ' * len(header)
        lines = msg['text'].splitlines()
        print(f"{header}{lines[0]}")
        for line in lines[1:]:
            if line.strip():
                print(f"{indent}{line}")
        n += 1

    return n

def main():
    parser = argparse.ArgumentParser(description='View KUANA Claude chat history')
    parser.add_argument('-s', '--session', type=int, help='Show only this session number (1-based)')
    parser.add_argument('-k', '--keyword', type=str, help='Filter messages containing this keyword')
    args = parser.parse_args()

    sessions = load_sessions()

    print(f'\nKUANA Claude Chat History')
    print(f'Found {len(sessions)} session(s) in:\n  {PROJECT_DIR}\n')

    if args.session:
        idx = args.session
        if idx < 1 or idx > len(sessions):
            print(f'Error: session {idx} not found. Available: 1–{len(sessions)}')
            sys.exit(1)
        print_session(idx, sessions[idx - 1], keyword=args.keyword)
    else:
        counter = 1
        for i, session in enumerate(sessions, start=1):
            counter = print_session(i, session, keyword=args.keyword, counter_start=counter)

    print('\n' + '─' * 72)
    if args.keyword:
        print(f'  Filtered by keyword: "{args.keyword}"')
    print(f'  Sessions: {len(sessions)}  •  Run with -h for options')
    print('─' * 72 + '\n')

if __name__ == '__main__':
    main()
