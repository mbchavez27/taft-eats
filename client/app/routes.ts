import {
  type RouteConfig,
  route,
  index,
  prefix,
  layout,
} from '@react-router/dev/routes'

export default [
  layout('./routes/layout.tsx', [
    index('./routes/index.tsx'),

    ...prefix('restaurants', [
      route('owner', './routes/restaurants/owner/index.tsx'),
      route(':restaurant_id', './routes/restaurants/index.tsx'),
    ]),

    ...prefix('user', [route('/', './routes/user-page/index.tsx')]),
    ...prefix('bookmarks', [route('/', './routes/bookmarks/index.tsx')]),

    ...prefix('maps', [route('/', './routes/map-view/index.tsx')]),

    ...prefix('auth', [
      route('login', './routes/auth/login/index.tsx'),
      route('sign-up', './routes/auth/sign-up/index.tsx'),
    ]),
  ]),

  ...prefix('admin', [
    layout('./routes/admin/layout.tsx', [
      index('./routes/admin/index.tsx'),

      route('establishments', './routes/admin/establishments/index.tsx'),
      route('reviews', './routes/admin/reviews/index.tsx'),
    ]),
  ]),
] satisfies RouteConfig
