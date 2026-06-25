# Kakao Map Setup

## 1. Required Environment

```text
VITE_MAP_PROVIDER=kakao
VITE_KAKAO_JAVASCRIPT_KEY=<public JavaScript key>
```

The JavaScript key is public configuration, but it must be restricted by allowed domains in Kakao Developers. Never place admin keys or REST API secrets in browser environment variables.

## 2. Kakao Developer Console

1. Create or open the LOCA Kakao Developers application.
2. Enable Kakao Maps JavaScript API.
3. Add local and deployed domains:
   - `http://localhost:5173`
   - Vercel preview domains used for QA
   - production domain
4. Copy the JavaScript key into `.env.local`.

## 3. Adapter Responsibilities

The Kakao adapter must provide:

- keyword place search;
- nearby search using current coordinates only as a suggestion source;
- address search;
- reverse geocoding from coordinates;
- map pin preview and adjustment;
- place candidate distance display.

The adapter returns LOCA provider-neutral results:

```ts
type PlaceSearchResult = {
  readonly provider: "kakao"
  readonly providerPlaceId: string
  readonly name: string
  readonly address: string
  readonly coordinates: Coordinates
  readonly category: string
}
```

## 4. Privacy Rule

Current location is used only to rank or suggest nearby place candidates. LOCA must not automatically publish the user's current location or exact stay state.

## 5. Demo Fallback

When Kakao configuration is absent, local UI QA should run with:

```text
VITE_DEMO_MODE=true
VITE_MAP_PROVIDER=demo
```

Production mode must not silently replace Kakao with demo data.
