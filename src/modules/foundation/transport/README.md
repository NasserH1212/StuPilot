# Foundation transport boundary

No HTTP endpoint is implemented in Sprint 0. This directory reserves the feature-owned transport boundary; future `/api/v1` handlers may translate HTTP input into application-service calls, but may not access persistence directly.
