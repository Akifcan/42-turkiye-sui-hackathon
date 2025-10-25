# Walrus On-Chain LinkTree — Hackathon Rehberi

# Linktree Nedir?

Linktree, kullanıcıların tüm önemli bağlantılarını tek bir sayfada toplayıp paylaşmalarını sağlayan bir web sitesidir. Uygulama sayesinde kullanıcılar sosyal medya profillerine ekledikleri tek bir bağlantı üzerinden web siteleri, sosyal medya hesapları, ürün sayfaları veya içeriklerine kolayca yönlendirme yapabilir.

[https://linktr.ee](https://linktr.ee/)

## 1) Ürün: Neyi inşa ediyoruz?

**On-chain LinkTree**. Klasik Linktree’nin zincir üzerindeki sürümü:

- Profil bilgileri Onchain objelerde tutuluyor Sui ağında
- Frontend (HTML/CSS/JS) dosyalarını **Walrus**’a blob olarak yazıyoruz.
- Mysten SDK ile beraber Obje okuma, Fonksiyon çağırma işlemlerini yapıyoruz
- SuiNS ile beraber sitemize domain gibi bir isim ekleyeceğiz.

Walrus genel giriş: ([docs.wal.app](https://docs.wal.app/?utm_source=chatgpt.com))
Walrus Sites kavramı ve yayın akışı (resmî doküman): ([docs.wal.app](https://docs.wal.app/walrus-sites/tutorial-install.html?utm_source=chatgpt.com))

**Linkler**

- https://www.walrus.xyz/get-started
- https://docs.wal.app/
- https://docs.wal.app/walrus-sites/tutorial-install.html
- https://docs.wal.app/walrus-sites/tutorial-publish.html
- https://docs.wal.app/walrus-sites/tutorial.html

---

## 2) Yapı Görevleri (Yarışmacı görev tanımı)

### 2.1 Sui akıllı sözleşmesi (Move)

- **Amaç:** “LinkTreeProfile” benzeri **tek bir obje tipi** tanımlayın. Bu obje; başlık/ad, avatar CID’i, kısa bio, link listesi (label + url), tema gibi alanları **on-chain** tutsun (Burayı sizin hayal gücünüz bırakıyoruz.
- **Ekstra (güçlü artı):** *Dynamic fields* ile `name → object_id` ([https://move-book.com/programmability/dynamic-fields](https://move-book.com/programmability/dynamic-fields)) eşleme tutarak, okunabilir bir isimden profil objesine çözümleme yapın .

**Link**

```
https://move-book.com/ (Sui Move a giriş, nasıl akıllı sözleşme yazarım?)
https://move-book.com/move-basics/
https://move-book.com/programmability/dynamic-fields
https://docs.sui.io/guides/developer/getting-started/hello-world
https://docs.sui.io/guides/developer/sui-101
```

### 2.2 Web uygulaması (React + Vite + dApp Kit)

- **Ana sayfa:** Cüzdan bağlama → yeni profil objesi oluşturma/güncelleme akışı (dApp Kit + TS SDK ile tx).
- **Dinamik görüntüleme sayfası:** URL parametresinden `objectId`  veya “Dynamic Field” kullanıyorsanız eğer value u alıp Sui RPC’den ilgili objeyi okuyun; link kartlarını, avatar/bio’yu vs render edin.

**Linkler**

```
https://sdk.mystenlabs.com/dapp-kit/create-dapp
https://sdk.mystenlabs.com/typescript
https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQueries.html
https://sdk.mystenlabs.com/typedoc/functions/_mysten_dapp-kit.useSuiClientQuery.html

```

### 2.3 Walrus Sites olarak yayın

- `ws-resources.json` ile **genel configurasyonu yapabilirsiniz**:
    
    ```json
    {
      "site_name": "My Walrus Site",
      "object_id": "0xfcafadd6894321705815d0b1f28246589d7e7127f52e417dc2338fa663a6e003"
    }
    
    ```
    
- `site-builder deploy ./<proje-klasörü> --epochs 1` → çıktıdaki **B36** ile hemen test edin.

**Linkler**

```
https://docs.wal.app/walrus-sites/tutorial-publish.html
https://docs.wal.app/walrus-sites/routing.html
https://docs.wal.app/walrus-sites/linking.html

```

### 2.4 SuiNS bağlama

- Takım/ürün adınızı `.sui` olarak alın ve **site objesine** yönlendirin → portalda `https://<ad>.trwal.app/`.
Not:
[https://docs.wal.app/walrus-sites/tutorial-suins.html](https://docs.wal.app/walrus-sites/tutorial-suins.html)
SuiNS adı almak için:
[https://testnet.suins.io/](https://testnet.suins.io/)
- Sorgulama/işlem örnekleri için SuiNS geliştirici sayfalarını kullanın. ([docs.wal.app](https://docs.wal.app/walrus-sites/tutorial.html?utm_source=chatgpt.com))

**Linkler**

```
https://docs.suins.io/
https://docs.suins.io/developer/sdk
https://docs.suins.io/developer/sdk/querying
https://docs.suins.io/developer/sdk/transactions

```

---

---

## 3) Zorunlu ve Önerilen Özellikler

**Zorunlu**

- Walrus Site olarak yayınlanan **on-chain LinkTree** sayfası.
- **SuiNS** entegrasyonu: `.sui` adının Walrus Site objesine yönlendirilmesi. ([docs.wal.app](https://docs.wal.app/walrus-sites/tutorial-suins.html))

**Önerilen**

- **Flatland yaklaşımı**: *Her obje id/NFT için → kendi sayfası*. Bu deseni inceleyin. ([https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland](https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland)
, [https://flatland.wal.app](https://flatland.wal.app/))
- **Mysten dApp Kit** ile cüzdan bağlama ve RPC sorguları.
- (Opsiyonel) zkLogin Entegrasyonu ([https://github.com/MystenLabs/sui-move-community-modules/tree/main/module_5](https://github.com/MystenLabs/sui-move-community-modules/tree/main/module_5))
- **(Opsiyonel)** Sponsored transactions. ([https://docs.enoki.mystenlabs.com/ts-sdk/examples](https://docs.enoki.mystenlabs.com/ts-sdk/examples))

**Linkler**

```
https://docs.wal.app/walrus-sites/intro.html
https://github.com/MystenLabs/walrus-sites
https://sdk.mystenlabs.com/dapp-kit
https://docs.enoki.mystenlabs.com/ts-sdk/examples

Hem zkLogin hemde Sponsored Gas Kod Örneği:
https://github.com/MystenLabs/sui-move-community-modules/tree/main/module_5
```

## 4) Kurulum — Gerekli Araçlar

### 4.1 Sui CLI (Windows / macOS / Ubuntu)

- Resmî kurulum rehberi (suiup, brew, choco dâhil). Kurulum sonrası: `sui --version`.

**Link**

```
https://docs.sui.io/guides/developer/getting-started/sui-install

```

### 4.2 Walrus ortamı

- Walrus “Getting Started” ve “Usage / Setup / Networks” adımlarını izleyin. (Cüzdan, ağ seçimi, testnet ayarları)

**Linkler**

```
https://docs.wal.app/usage/started.html
https://docs.wal.app/usage/setup.html
https://docs.wal.app/usage/networks.html

```

### 4.3 Walrus **Site-Builder**

- Kurulum ve yayın komutları (publish/deploy/update) — SPA’ler için routing/redirects kritik.

**Linkler**

```
https://docs.wal.app/walrus-sites/tutorial-install.html
https://docs.wal.app/walrus-sites/commands.html
https://docs.wal.app/walrus-sites/linking.html
https://docs.wal.app/walrus-sites/redirects.html

```

### 4.3.1) TRWal entegrasyonu (katılımcı tarafı sites-config)

`$HOME/walrus/sites-config.yaml` dosyanızı aşağıdaki gibi ayarlayın (testnet):

```yaml
contexts:
  testnet:
    # module: site
    portal: trwal.app
    package: 0xf99aee9f21493e1590e7e5a9aea6f343a1f381031a04a732724871fc294be799
    staking_object: 0xbe46180321c30aab2f8b3501e24048377287fa708018a5b7c2792b35fe339ee3
    general:
       wallet_env: testnet
       walrus_context: testnet # Assumes a Walrus CLI setup with a multi-config containing the "testnet" context.
       walrus_package: 0xd84704c17fc870b8764832c535aa6b11f21a95cd6f5bb38a9b07d2cf42220c66
       # wallet_address: 0x1234...
       # rpc_url: https://fullnode.testnet.sui.io:443
       # wallet: /path/to/.sui/sui_config/client.yaml
       # walrus_binary: /path/to/walrus
       # walrus_config: /path/to/testnet/client_config.yaml
       # gas_budget: 500000000
  mainnet:
    # module: site
    # portal: wal.app
    package: 0x26eb7ee8688da02c5f671679524e379f0b837a12f1d1d799f255b7eea260ad27
    staking_object: 0x10b9d30c28448939ce6c4d6c6e0ffce4a7f8a4ada8248bdad09ef8b70e4a3904
    general:
       wallet_env: mainnet
       walrus_context: mainnet # Assumes a Walrus CLI setup with a multi-config containing the "mainnet" context.
       walrus_package: 0xfdc88f7d7cf30afab2f82e8380d11ee8f70efb90e863d1de8616fae1bb09ea77
       # wallet_address: 0x1234...
       # rpc_url: https://fullnode.mainnet.sui.io:443
       # wallet: /path/to/.sui/sui_config/client.yaml
       # walrus_binary: /path/to/walrus
       # walrus_config: /path/to/mainnet/client_config.yaml
       # gas_budget: 500000000

default_context: testnet
```

- Yayın: `site-builder deploy ./dist --epochs 1`
- Görüntüleme:
    - **B36**: `https://<b36>.trwal.app/`
    - **SuiNS**: `https://<name>.trwal.app/`

**Linkler**

```
https://docs.wal.app/walrus-sites/commands.html
https://docs.wal.app/walrus-sites/builder-config.html

```

### 4.4 VS Code + Move Eklentileri

- **Move Analyzer (Mysten)**: sözdizimi/renk, goto-def, test/build entegrasyonu. ([Gist](https://gist.github.com/bartosian/dcfed3a1cb09c3263222255f8354e2df?utm_source=chatgpt.com))

**Link**

```
https://docs.sui.io/references/ide/move

```

### 4.5 Frontend SDK’ları

- **Mysten dApp Kit** — `npm create @mysten/dapp` starter ile hızlı React şablonu.
- **Sui TypeScript SDK** — RPC sorguları ve işlem inşası.

**Linkler**

```
https://sdk.mystenlabs.com/dapp-kit
https://sdk.mystenlabs.com/dapp-kit/create-dapp
https://sdk.mystenlabs.com/typescript

```

---

## 5) Walrus Sitelerine Erişim

1. React ile LinkTree arayüzünüzü build edersiniz → **site-builder** walrus blob’larını oluşturur ve **Sui** üzerinde site objesini yazar. ([https://docs.wal.app/walrus-sites/overview.html](https://docs.wal.app/walrus-sites/overview.html))
2. **TRWal portal** site kaynaklarını toplayıp kullanıcıya sunar. 
3. Erişim:
    - **B36**: `https://<b36-oid>.trwal.app/`
    - **SuiNS**: `https://<ad>.trwal.app/` (portal SuiNS -> site objesine çözer)

**Linkler**

```
https://docs.wal.app/walrus-sites/tutorial-publish.html
https://github.com/MystenLabs/example-walrus-sites (Örnek Walrus siteleri)
```

---

## 6) Flatland — Neden kritik örnek?

Flatland; *“her NFT’ye özel web sayfası”* desenini **Walrus Site** ile gösterir. Biz LinkTree’de “her kullanıcı profili → bir site” kuruyoruz; Flatland kodu yayın akışı, yönlendirme, obje-site ilişkisi için referanstır. 

**Linkler**

```
https://github.com/MystenLabs/example-walrus-sites (Diğer örnek siteler burdan erişebilirsiniz)
https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland

```

---

## 7) İleri Konular: Redirect & Linking

- **Redirects:** Objeden site’ye yönlendirme yaparken portalın **maksimum redirect derinliği** sınırını aşmayın. (wal.app örneği 3). ([docs.wal.app](https://docs.wal.app/walrus-sites/restrictions.html?utm_source=chatgpt.com))
- **Linking:** Site içi/dışı linkler “normal web” mantığına yakındır; server-side portal sınırlamalarını ve en iyi uygulamaları okuyun. ([docs.wal.app](https://docs.wal.app/walrus-sites/linking.html?utm_source=chatgpt.com))

**Linkler**

```
https://docs.wal.app/walrus-sites/redirects.html
https://docs.wal.app/walrus-sites/linking.html

```

---

## 8) Explorer’lar (Testnet)

```
https://suiscan.xyz/testnet
https://walruscan.com/testnet

```

---

## 9) Teslim Formatı

<aside>
💡

Tüm sunumlar **İngilizce** olmalıdır

</aside>

- Github repo linki
- Çalışır web app linki
- İngilizce sunum
- 3–5 dk demo video

---

### Ek Yararlı Bağlantılar (toplu)

```
Walrus Install/Publish: https://docs.wal.app/walrus-sites/tutorial-install.html
Walrus Publish: https://docs.wal.app/walrus-sites/tutorial-publish.html
Walrus Your First Site: https://docs.wal.app/walrus-sites/tutorial.html
Walrus Commands: https://docs.wal.app/walrus-sites/commands.html
Walrus Builder Config: https://docs.wal.app/walrus-sites/builder-config.html
Walrus Routing: https://docs.wal.app/walrus-sites/routing.html
Walrus Linking: https://docs.wal.app/walrus-sites/linking.html
Walrus Redirects: https://docs.wal.app/walrus-sites/redirects.html
Walrus Usage (started/setup/networks): https://docs.wal.app/usage/started.html
Walrus Usage Setup: https://docs.wal.app/usage/setup.html
Walrus Usage Networks: https://docs.wal.app/usage/networks.html

SuiNS Docs: https://docs.suins.io/
SuiNS SDK: https://docs.suins.io/developer/sdk
SuiNS Querying: https://docs.suins.io/developer/sdk/querying
SuiNS Transactions: https://docs.suins.io/developer/sdk/transactions

Mysten dApp Kit: https://sdk.mystenlabs.com/dapp-kit
Mysten dApp Kit (create-dapp): https://sdk.mystenlabs.com/dapp-kit/create-dapp
Sui TypeScript SDK: https://sdk.mystenlabs.com/typescript

Sui CLI Install (Win/macOS/Linux): https://docs.sui.io/guides/developer/getting-started/sui-install
Move (kitap): https://move-book.com/
VS Code Move eklentisi: https://docs.sui.io/references/ide/move

Örnekler:
example-walrus-sites: https://github.com/MystenLabs/example-walrus-sites
flatland: https://github.com/MystenLabs/example-walrus-sites/tree/main/flatland

```

---