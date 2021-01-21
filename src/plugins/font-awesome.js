import Vue from 'vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCopy, faDownload, faInfoCircle, faCalendarAlt, faThumbsUp, faThumbsDown, faCreditCard, faCoins} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(
    faDownload,
    faCopy,
    faInfoCircle,
    faCalendarAlt,
    faThumbsUp,
    faThumbsDown,
    faCreditCard,
    faCoins
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
