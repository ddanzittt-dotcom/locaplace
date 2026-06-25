# Map Provider Setup

The MVP ships with a Demo map provider. The provider contract is intentionally small:

- `renderMap`
- `geocode`
- `reverseGeocode`
- `search`
- `nearby`

Kakao Maps is the production target. Add `VITE_MAP_PROVIDER=kakao` and `VITE_KAKAO_JAVASCRIPT_KEY` after creating a Kakao Developers app and configuring the allowed web domains.

The map adapter must keep Kakao-specific details behind the provider boundary. Domain records store `provider = "kakao"` and `provider_place_id` instead of Kakao-only field names.

`VITE_MAP_PROVIDER=demo` remains the local default for fixture-backed QA.
