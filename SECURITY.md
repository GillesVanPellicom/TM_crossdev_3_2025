# Security

This document outlines the security measures taken in this Electron application to ensure safe IPC and protect against common vulnerabilities.

## Electron Security Best Practices

We follow the latest security recommendations from the Electron documentation.

### 1. Only load secure content
All content is loaded from the local filesystem (`file://` protocol). The application does not load any remote content. This is enforced by the `will-navigate` event handler in `src/electron-main.ts:58`.

### 2. Do not enable Node.js integration for remote content
Node.js integration is disabled for all renderer processes in `src/electron-main.ts:32`.

### 3. Enable context isolation in all renderers
`contextIsolation` is enabled for all renderer processes in `src/electron-main.ts:30`.

### 4. Enable process sandboxing
Process sandboxing is enabled for all renderer processes by setting `sandbox: true` in the `webPreferences` in `src/electron-main.ts:34`.

### 5. Use ses.setPermissionRequestHandler() in all sessions that load remote content
The application does not load remote content, so this is not applicable.

### 6. Do not disable webSecurity
`webSecurity` is not disabled. This is the default setting in Electron.

### 7. Define a Content-Security-Policy
A Content Security Policy is defined to only allow scripts to be loaded from the application's own origin (`script-src 'self'`) in `src/electron-main.ts:75`. This policy now fully prevents the use of `eval()` and `new Function()`.

### 8. Do not enable allowRunningInsecureContent
`allowRunningInsecureContent` is not enabled. This is the default setting in Electron.

### 9. Do not enable experimental features
No experimental features are enabled.

### 10. Do not use enableBlinkFeatures
`enableBlinkFeatures` is not used.

### 11. <webview>: Do not use allowpopups
The `<webview>` tag is not used.

### 12. <webview>: Verify options and params
The `<webview>` tag is not used.

### 13. Disable or limit navigation
Navigation is limited to `file://` URLs. Any attempt to navigate to an external URL is prevented in `src/electron-main.ts:58`.

### 14. Disable or limit creation of new windows
The creation of new windows is disabled using `setWindowOpenHandler` in `src/electron-main.ts:65`.

### 15. Do not use shell.openExternal with untrusted content
`shell.openExternal` is not used.

### 16. Use a current version of Electron
The project should be kept up-to-date with the latest version of Electron to ensure all known vulnerabilities are patched.

### 17. Validate the sender of all IPC messages
The sender of IPC messages is validated to ensure that only windows with a `file://` URL can trigger IPC calls in `src/electron-main.ts:141`.

### 18. Avoid usage of the file:// protocol and prefer usage of custom protocols
The application currently uses the `file://` protocol to load local content. For enhanced security, this could be replaced with a custom protocol in the future.

### 19. Check which fuses you can change
Electron Fuses can be used to further lock down the application's security. This has not yet been implemented, but is a recommended future enhancement.

### 20. Do not expose Electron APIs to untrusted web content
Electron APIs are not exposed to untrusted web content. A limited API is exposed to the renderer process via a preload script and `contextBridge` in `preload.js:3`.

## Input Sanitization and Expression Evaluation

The calculator components (`normal-calculator.component.ts` and `scientific-calculator.component.ts`) now use a custom `ExpressionEvaluationService` (`src/app/expression-evaluation.service.ts`) for evaluating mathematical expressions. This change addresses the security concerns related to `eval()` and `new Function()` and allows for a stricter Content Security Policy.

### Custom Expression Parser

The `ExpressionEvaluationService` implements a safe expression parser based on the Shunting-yard algorithm. This approach:
- **Eliminates `eval()` and `new Function()`:** Directly removes the security risks associated with dynamic code execution.
- **CSP Compliant:** Allows the application to enforce a `script-src 'self'` Content Security Policy without issues.
- **Controlled Evaluation:** Only processes predefined mathematical operations, numbers, parentheses, and unary functions, preventing the execution of arbitrary code.
- **Unary Minus Handling:** The parser correctly distinguishes between binary subtraction and unary minus operators, ensuring accurate evaluation of expressions like `-5 * 2` or `sin(-30)`.

### Recommendation for Production

For a production-ready application, the `ExpressionEvaluationService` could be further enhanced to support a wider range of mathematical operations and functions, while maintaining its secure parsing approach. This ensures that all calculations are performed within a controlled and secure environment.

By implementing these security measures, we have created a robust and secure Electron application that is well-protected against common vulnerabilities.
