#!/bin/sh
# KUANA Claude Chat History Viewer
# Usage:
#   sh chat-history.sh              # show all sessions
#   sh chat-history.sh -s 1         # show only session 1
#   sh chat-history.sh -k deploy    # filter by keyword
#   sh chat-history.sh -s 2 -k venue

PROJECT_DIR="$HOME/.claude/projects/-Users-kushanmaskey-Personal-Projects-workspace-Claude-kuana"
SESSION_FILTER=""
KEYWORD=""

while [ $# -gt 0 ]; do
  case "$1" in
    -s) SESSION_FILTER="$2"; shift; shift ;;
    -k) KEYWORD="$2"; shift; shift ;;
    -h)
      echo "Usage: sh chat-history.sh [-s SESSION] [-k KEYWORD]"
      echo "  -s N   Show only session N (1-based)"
      echo "  -k STR Filter messages containing keyword"
      exit 0 ;;
    *) echo "Unknown option: $1. Use -h for help."; exit 1 ;;
  esac
done

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Error: session directory not found:"
  echo "  $PROJECT_DIR"
  exit 1
fi

TOTAL=$(ls "$PROJECT_DIR"/*.jsonl 2>/dev/null | wc -l | tr -d ' ')

if [ "$TOTAL" -eq 0 ]; then
  echo "No session files found."
  exit 0
fi

echo ""
echo "KUANA Claude Chat History"
echo "Found $TOTAL session(s)"
echo ""

COUNTER_FILE=$(mktemp /tmp/kuana_counter_XXXXXX)
echo "1" > "$COUNTER_FILE"

SESSION_IDX=0

for FILE in $(ls "$PROJECT_DIR"/*.jsonl 2>/dev/null | sort); do
  SESSION_IDX=$((SESSION_IDX + 1))

  if [ -n "$SESSION_FILTER" ] && [ "$SESSION_IDX" != "$SESSION_FILTER" ]; then
    continue
  fi

  FILE_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$FILE" 2>/dev/null)
  FILE_ID=$(basename "$FILE" | cut -c1-8)
  GLOBAL_NUM=$(cat "$COUNTER_FILE")

  MSGS_FILE=$(mktemp /tmp/kuana_msgs_XXXXXX)
  COUNT_FILE=$(mktemp /tmp/kuana_count_XXXXXX)

  python3 - "$FILE" > "$MSGS_FILE" << 'PYEOF'
import sys, json
path = sys.argv[1]
skip = (
  '<system-reminder', '<local-command', '<command-name',
  '<function_calls', 'This session is being continued', 'Summary:'
)
with open(path, encoding='utf-8') as f:
    for line in f:
        try:
            obj = json.loads(line)
        except Exception:
            continue
        if obj.get('type') != 'user':
            continue
        content = obj.get('message', {}).get('content', '')
        if isinstance(content, list):
            text = ' '.join(
                b.get('text', '') for b in content
                if isinstance(b, dict) and b.get('type') == 'text'
            ).strip()
        elif isinstance(content, str):
            text = content.strip()
        else:
            continue
        if not text or any(text.startswith(s) for s in skip):
            continue
        print(text)
        print('---MSG_END---')
PYEOF

  awk \
    -v session="$SESSION_IDX" \
    -v date="$FILE_DATE" \
    -v fileid="$FILE_ID" \
    -v startnum="$GLOBAL_NUM" \
    -v keyword="$KEYWORD" \
    -v countfile="$COUNT_FILE" \
    'BEGIN {
      msg = ""
      num = startnum + 0
      header = 0
    }
    /^---MSG_END---$/ {
      if (msg != "") {
        show = 1
        if (keyword != "" && index(tolower(msg), tolower(keyword)) == 0) show = 0
        if (show) {
          if (!header) {
            print "========================================================================"
            printf "  SESSION %d  |  %s  |  ID: %s...\n", session, date, fileid
            print "========================================================================"
            header = 1
          }
          n = split(msg, lines, "\n")
          printf "  %4d. %s\n", num, lines[1]
          for (i = 2; i <= n; i++) {
            if (lines[i] != "") printf "       %s\n", lines[i]
          }
          num++
        }
      }
      msg = ""
      next
    }
    {
      if (msg == "") msg = $0
      else msg = msg "\n" $0
    }
    END {
      print num > countfile
    }' "$MSGS_FILE"

  if [ -f "$COUNT_FILE" ] && [ -s "$COUNT_FILE" ]; then
    cat "$COUNT_FILE" > "$COUNTER_FILE"
  fi

  rm -f "$MSGS_FILE" "$COUNT_FILE"
done

rm -f "$COUNTER_FILE"

echo ""
echo "------------------------------------------------------------------------"
if [ -n "$KEYWORD" ]; then
  echo "  Filtered by keyword: \"$KEYWORD\""
fi
echo "  Sessions: $TOTAL  |  Run with -h for options"
echo "------------------------------------------------------------------------"
echo ""
