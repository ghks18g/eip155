# EIP-155: Simple Replay Attack Protection

[EIP-155](https://eips.ethereum.org/EIPS/eip-155)는 이더리움에서 체인 간 트랜잭션 재플레이 공격을 방지하기 위한 개선 제안입니다.

## 🧠 개요

- 2016년 Ethereum의 하드포크(Dao 사건 이후) 로 인해 체인이 Ethereum (ETH) 와 Ethereum Classic (ETC) 으로 나뉘면서, 동일한 서명으로 양쪽 체인에서 트랜잭션이 실행되는 취약점이 발생했습니다.
- 하드포크 이후 체인 간 호환성 이슈 해결
- 트랜잭션에 `chainId` 값을 추가하여 재사용 불가하게 만듦
- 서명 방식 변경을 통해 보안성 향상

## 🧪 트랜잭션 변경 내용

- 기존의 `v` 값은 `27` 또는 `28`이었으나,
- EIP-155 적용 시에는 `v = chainId * 2 + 35 or 36`

  예시 (chainId = 1):

  ```
  v = 1 * 2 + 35 = 37 또는 38

  // 이로 인해 트랜잭션은 오직 해당 체인 ID를 사용하는 네트워크에서만 유효합니다.
  ```

## 📦 적용 효과

| 항목           | 설명                                                              |
| -------------- | ----------------------------------------------------------------- |
| 보안 강화      | 트랜잭션 재플레이 공격 방지                                       |
| 체인 분리 보장 | 하드포크 이후 체인 간의 충돌 예방                                 |
| 표준화         | 이후 EIP-2718, EIP-2930, EIP-1559 같은 트랜잭션 포맷에서도 활용됨 |

## 🔐 장점

- Replay Attack 방지
- 포크된 체인 간 충돌 해결
- 향후 트랜잭션 포맷 확장 기반 제공

## 🔧 적용 매커니즘

| 단계                                                     | 설명                                                             | EIP-155 적용 여부                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| `signTransaction()`                                      | 트랜잭션 객체에 서명 (직접 `chainId`가 명시되었는지에 따라 다름) | 사용자가 명시하거나 네트워크에서 추론 가능하면 적용됨 |
| `contract.method.send()` 또는 `wallet.sendTransaction()` | 트랜잭션을 자동 생성 + 서명 + 전송                               | EIP-155 자동 적용 (기본적으로 `chainId` 포함됨)       |
| `signMessage()`                                          | 일반 메세지 서명                                                 | EIP-155 와 무관 ( EIP 191 적용)                       |

## 🔍 `ethers.js` 트랜잭션 서명 흐름

1. `signTransaction`

   - `wallet.signTransaction(txObject)` 호출시, `txObject` 객체에 `chainId`가 포함되어 있다면 EIP-155 매커니즘 적용
   - `chainId`가 포함되어 있지 않으면, Legacy( EIP 155 미적용) 매커니즘 적용

2. `wallet.sendTransaction(txObject)` 또는 `Contract.method(args)` 호출
   1. `populateTransaction()`을 통해 transaction 객체 자동 완성 ( `nonce`,`chainId`,`gasLimit`, etc..)
   2. `signTransaction()` 이때, `chainId`를 포함하여 EIP 155 매커니즘 적용
   3. `provider.sendTransaction()` 네트워크로 transaction 전송.

## ⚙️ Geth (go-ethereum)의 검증 흐름

1. 트랜잭션 RLP 디코딩

- RLP 로 인코딩된 Transaction 데이터 파싱
- 파싱 과정에서 `r`,`s`,`v` 추출

2. `v` 값을 기준으로 EIP 155 적용 여부 판단

- `v = chainId * 2 + (35 or 36)`을 역산하여 `chainId`를 추출

3. 서명 대상 데이터 구성

- Legacy (v= 27/28) : `keccak256(rlp([nonce, gasPrice, gasLimit, to, value, data]))`
- EIP-155 : `keccak256(rlp([nonce, gasPrice, gasLimit, to, value, data, chainId, 0, 0]))`

4. `ecrecover` 를 통해 주소 복원

- `ecrecover(messageHash, v, r, s)` 를 사용해 보낸 사람 주소(sender) 를 복원합니다.

## Geth 버전에 따라 EIP-155 지원 여부가 달라짐

- `v1.5.9` 이후 버전에 적용
- `v1.5.9` 이전의 Geth는 v ≥ 35인 트랜잭션을 처리하지 못합니다.
  ```
  invalid signature: v is too high
  ```

## Geth 설정에 따라 EIP 적용 여부를 특정 블록 높이 기준으로 설정 가능

```
params.MainnetChainConfig = &ChainConfig{
    ...
    EIP155Block: big.NewInt(2675000),
}
// 블록 높이 < 2,675,000에서는 EIP-155가 적용되지 않고, 이후부터 적용됩니다.
```

## 📚 관련 문서

- [EIP-155 공식 문서](https://eips.ethereum.org/EIPS/eip-155)
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)

---
