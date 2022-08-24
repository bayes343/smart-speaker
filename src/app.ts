import { App, Environments } from 'fyord';
import { DevelopmentEnvironmentVariables, ProductionEnvironmentVariables } from './environments';

export const app = App.Instance(
  process.env.NODE_ENV || Environments.Production,
  ProductionEnvironmentVariables,
  DevelopmentEnvironmentVariables);

window['app'] = app;
