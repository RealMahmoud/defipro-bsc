import Vue from 'vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faCalendarAlt,
    faCoins,
    faCopy,
    faCreditCard,
    faDownload,
    faFileCode,
    faInfoCircle,
    faSignInAlt,
    faStore,
    faStoreSlash,
    faThumbsDown,
    faThumbsUp,
    faTrash,
    faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(
    faDownload,
    faCopy,
    faInfoCircle,
    faCalendarAlt,
    faThumbsUp,
    faThumbsDown,
    faCreditCard,
    faCoins,
    faTrash,
    faStoreSlash,
    faStore,
    faFileCode,
    faSignInAlt,
    faExchangeAlt,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
