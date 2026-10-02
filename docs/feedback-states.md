# Feedback states

`FeedbackState` gives internal consoles one compact visual grammar for four
truthfully different results:

- `checking`: the current read has not completed;
- `empty`: the read completed successfully and found nothing;
- `unavailable`: the source does not currently provide the information;
- `error`: the read or operation failed.

The component maps these states to product-neutral tones, but consumers may
override the tone. It sets `aria-busy` only for `checking`. It does not add
`role="alert"` or a live region because only the product knows whether the
state appeared dynamically and requires immediate announcement.

`InlineNotice` is the dense companion for information that sits inside a
normal page composition. It supports a title, description, optional value,
icon, action, and the shared status-tone vocabulary. It likewise does not infer
live behavior.

Products remain responsible for mapping domain values, deciding whether prior
data remains visible, and choosing retry or recovery behavior.
