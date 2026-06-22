# Map Provider Setup

The MVP ships with a Demo map provider. The provider contract is intentionally small:

- `renderMap`
- `geocode`
- `reverseGeocode`
- `search`
- `nearby`

Naver Maps is the first production target. Add `VITE_NAVER_MAP_CLIENT_ID` after creating an application in the Naver Cloud console, then implement the adapter behind the existing provider contract. The domain model must continue storing provider name and provider place ID instead of Naver-specific fields.
