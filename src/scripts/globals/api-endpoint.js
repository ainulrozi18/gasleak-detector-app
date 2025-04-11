import {CONFIG} from './config';
import mqtt from 'mqtt'

const API_ENDPOINT = {
  CLIENT:  mqtt.connect(CONFIG.BROKER, CONFIG.OPTIONS)
};

export default API_ENDPOINT;