# Enhanced Stop Hook with Learning Insights

The stop hook has been enhanced with learning insights functionality to help developers understand material changes made during Claude Code sessions.

## New Features

### Learning Insights Analysis
When enabled, the stop hook analyzes git changes and provides:
- Summary of files changed, added, and deleted
- Detection of new functions and classes introduced
- Identification of new dependencies/imports
- Configuration and test file change tracking
- Learning recommendations based on the changes

### Command-Line Options

- `--insights`: Enable learning insights analysis
- `--insights-detail [low|medium|high]`: Set detail level (default: medium)
  - **low**: Brief summary with minimal details
  - **medium**: Balanced summary with key learnings and recommendations
  - **high**: Comprehensive analysis with all details

### Usage Examples

```bash
# Basic usage (no insights)
claude code --stop-hook

# Enable learning insights with default detail
claude code --stop-hook --insights

# Enable high-detail learning insights
claude code --stop-hook --insights --insights-detail high
```

### How It Works

1. When Claude Code session ends, the hook analyzes git changes
2. It detects the project type (Python, JavaScript, TypeScript, etc.)
3. It extracts key information about what changed:
   - New functions/classes added
   - New imports/dependencies
   - Configuration changes
   - Test coverage updates
4. It generates a learning-focused summary
5. The summary is announced via TTS along with the completion message

### Benefits

- **Real-time Learning**: Understand what Claude changed immediately after the session
- **Pattern Recognition**: Identify new code patterns and architecture introduced
- **Dependency Awareness**: Know when new dependencies are added
- **Best Practice Reminders**: Get recommendations for code review and testing
- **Project-Aware**: Analysis is tailored to your project type

### Requirements

- Must be in a git repository for insights to work
- Git must be installed and accessible
- Changes must be committed for analysis

The insights feature gracefully falls back to standard completion announcement if:
- Not in a git repository
- Git is not available
- Any errors occur during analysis