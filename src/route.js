import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import index from './index';

export default function Routes() {
  return (
    <BrowserRouter>
      <div style={{ width: '100%', height: '100%' }}>
        <Route path="/" component={index} />
      </div>
    </BrowserRouter>
  );
}
