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

3. Issueの内容に基づいて、下記に従って実装プランを立ててください。
- ディレクトリ構造で、どこにどんな名前のファイルを作成・更新するかを明記してください。
- 各ファイルの実装方針を、具体のコードまでは明記せず方針を書いてください。
- 必要があればcontext7のMCPを使ってドキュメントを調べてください。
- .docs/plans/ディレクトリに、issue-{issue番号}.mdのファイル名でプランを保存してください。
