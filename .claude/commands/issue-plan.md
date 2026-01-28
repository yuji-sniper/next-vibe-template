# GitHub Issue実装プランコマンド

指定されたGitHub Issueの内容を読み取り、実装プランを立てます。

## 引数

- `$ARGUMENTS`: Issue番号

## 手順

1. 以下のコマンドでIssueの内容を取得してください:

```bash
gh issue view $ARGUMENTS --repo yuji-sniper/next-vibe-template
```

2. Issueの内容（タイトル・説明）を確認してください。

3. 実装プラン作成の共通ルールに従ってプランを立ててください。
   - 保存ファイル名: `issue-{issue番号}.md`
