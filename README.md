# Binance Hackathon: The Future Is Now
[![Actions Status](https://github.com/abdelhamidbakhta/defipro-bsc/workflows/defipro-bsc-ci/badge.svg)](https://github.com/abdelhamidbakhta/generator-eip/actions)
[![npm version](https://badge.fury.io/js/defibsc.svg?u)](https://www.npmjs.com/package/defibsc)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Twitter Follow](https://img.shields.io/twitter/follow/dimahledba)](https://twitter.com/dimahledba)
## 🔥 [Live Demo](https://defibsc-hackathon.surge.sh/) 🔥

The live demo works on [Binance Smart Chain testnet](https://testnet.bscscan.com/).

Youtube video

## 🦄 Introduction

This project implements a protocol to exchange `ERC20 compliant tokens` using **fully** decentralized, on-chain order book and **matching engine**.

## ⚙️ Setup

### Install Prerequisites

- [npm](https://www.npmjs.com/) package manager
- [@openzeppelin/cli](https://docs.openzeppelin.com/cli/2.7/)

## 🔗 On-Chain Protocol

The protocol is based on the Ethereum [OTC market](https://github.com/daifoundation/maker-otc) smart contract from the `daifoundation` and has been ported to a BSC smart contract.
The matching engine can be costly in terms of gas, hence the use of a BSC contract instead of an Ethereum contact makes a lot of sense.

### Compile the BSC contracts

```shell
npx oz compile
# OR
npm run compile-contracts
```

## 🌐 Decentralized Exchange Web Application

### 📦 Install

```
npm config set '@bit:registry' https://node.bit.dev
npm install
```

### 💻 Usage

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Format code using Prettier
```
npm run format
```

### 👏🏻 Support my open-source
If you like to support my open-source contributions please star and share this project. 💫

## 📄 License
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
