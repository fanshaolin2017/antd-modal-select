import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AsyncIndexs from './index';

export default function Routes() {
  return (
    <BrowserRouter>
      <div style={{ width: '100%', height: '100%' }}>
        <Route path="/" component={AsyncIndexs} />
      </div>
    </BrowserRouter>
  );
}
