# GitHub Issue実装プランコマンド

指定されたGitHub Issueの内容を読み取り、実装プランを立てます。

## 引数

- `$ARGUMENTS`: Issue番号

## 手順

1. 以下のコマンドでIssueの内容を取得してください:

```bash
gh issue view $ARGUMENTS --repo yuji-sniper/next-vibe-template
```

2. Issueの内容を確認し、以下を把握してください:
   - タイトル
   - 説明

3. Issueの内容に基づいて、rulesに従って実装プランを立ててください。
