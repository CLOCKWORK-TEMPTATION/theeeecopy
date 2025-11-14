/**
 * Web Vitals reporting
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB } from "web-vitals";

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onFID(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
}

export default reportWebVitals;
