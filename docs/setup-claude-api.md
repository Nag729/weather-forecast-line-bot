# Claude API セットアップ手順

## 1. APIキーの取得

1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. サインイン（アカウントがなければ作成）
3. **API Keys** → **Create Key**
4. キーをコピー（`sk-ant-...` 形式）

## 2. 環境変数の設定

`.env` ファイルに追加:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

## 3. 動作確認

```bash
npm run invoke:fetchWeather
```

ログに `[Done] generateWeatherAdvice` が出ればOK。

## 補足

- 使用モデル: `claude-opus-4-20250514`
- 1日1回の実行で月額数ドル程度
