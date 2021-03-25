import createReducer from './reducers';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';

export default function configureStore() {
  const composeEnhancers = typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
        compose;

  const store = createStore(
      createReducer(),
      composeEnhancers(applyMiddleware(thunk)),
  );

  return store;
}
