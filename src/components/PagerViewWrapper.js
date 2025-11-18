import React from 'react';
import { View } from 'react-native';

// This wrapper renders a View fallback since PagerView is not available
const PagerViewWrapper = React.forwardRef(({ children, ...props }, ref) => {
  // Always return View fallback since react-native-pager-view is removed
  return <View ref={ref} {...props}>{children}</View>;
});

export default PagerViewWrapper;

// Also export as named export to match react-native-pager-view API
export { PagerViewWrapper as PagerView };
