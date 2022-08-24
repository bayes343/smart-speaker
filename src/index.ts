import { app } from './app';
import { defaultLayout } from './layouts';
import './pages/module';
import './styles/base.scss';

(async () => {
  await app.Start(defaultLayout);
})();
