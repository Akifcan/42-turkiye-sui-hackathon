
## **Proje Dökümanı: AthliFi - The Inner Circle**

**Sui Blockchain Üzerinde Sporcu ve Taraftar Etkileşimini Yeniden Tanımlayan Merkeziyetsiz Bir Protokol**

### **Bölüm 1: Vizyon ve Fırsat**

#### **1.1. Sorun: Sporun Kalbindeki Finansal Uçurum**

Spor endüstrisi milyarlarca dolarlık bir dev olmasına rağmen, bu değerin büyük bir kısmı ekosistemin en tepesindeki küçük bir elit kesim arasında paylaşılmaktadır. Gelişmekte olan, potansiyel sahibi binlerce sporcu için ise gerçeklik çok farklıdır:

*   **Finansal Baskı:** Antrenman, seyahat, ekipman ve sağlık masrafları, kariyerlerini daha başlamadan bitirebilecek ezici bir yük oluşturur.
*   **Aracılı Destek Modelleri:** Geleneksel kitle fonlama platformları, hem şeffaflıktan yoksundur hem de yapılan bağışlardan %5-15 arasında değişen yüksek komisyonlar alarak sporcuya ulaşan değeri azaltır.
*   **Anlamsız Etkileşim:** Taraftarlar için destek olmak, genellikle tek yönlü ve duygusal bağdan yoksun bir para transferinden ibarettir. Taraftar, hikayenin bir parçası olduğunu hissedemez.

Bu bozuk denklem, hem sporcuların potansiyelini sınırlar hem de taraftar tutkusunun yaratabileceği gerçek ekonomik değeri kilitleyemez.

#### **1.2. Çözüm: AthliFi - Doğrulanabilir Aidiyet, Gerçek Etkileşim**

AthliFi, bu sorunu çözmek için Sui blockchain'inin temel mimari avantajlarını kullanan, yeni nesil bir protokoldür. Misyonumuz, bir sporcu ve onun en sadık destekçileri arasında, aracısız, şeffaf ve karşılıklı faydaya dayalı bir "İç Çember" (Inner Circle) ekonomisi yaratmaktır.

**AthliFi Nasıl Çalışır?**

1.  **Sporcu, İç Çember'ini Oluşturur:** Sporcular, AthliFi'de kendi on-chain profillerini oluşturur ve "İç Çember"lerine katılmak için bir destek bedeli (örneğin, 50 SUI) belirlerler.
2.  **Taraftar, İç Çember'e Katılır:** Taraftarlar, doğrudan sporcunun profili üzerinden, belirlenen miktarda destek olarak İç Çember'e katılırlar.
3.  **Destek, Bir "Anahtar"a Dönüşür:** Bu destek işlemi karşılığında, taraftarın cüzdanına otomatik olarak, o sporcunun İç Çember'ine aidiyetini kanıtlayan, benzersiz bir **"Destekçi Kartı" (Supporter Pass) NFT'si** basılır.
4.  **NFT, Ayrıcalıkların Kilidini Açar:** Bu NFT, bir dijital anahtardır. Taraftar, cüzdanında bu NFT'yi tuttuğu sürece, sporcunun profilindeki **herkese kapalı, sadece İç Çember'e özel içeriklere** (antrenman sırları, yarış sonrası kişisel analizler, ekipman incelemeleri, özel soru-cevap seansları) süresiz erişim hakkı kazanır.

Bu model, taraftarın finansal desteğini, doğrulanabilir bir aidiyet ve somut bir ayrıcalıkla ödüllendirir.

#### **1.3. İş Modeli ve Değer Önerisi**

*   **Sporcu için Değer:** %100 aracısız finansman, en sadık taraftar kitlesiyle doğrudan ve anlamlı bir bağ kurma imkanı ve kendi ekonomisinin tam kontrolü.
*   **Taraftar için Değer:** Sadece bir bağışçı değil, sporcunun yolculuğunun doğrulanabilir bir parçası olma hissi. Sevdiği sporcunun başka hiç kimsenin görmediği perde arkası dünyasına özel erişim hakkı.
*   **Protokol için Sürdürülebilirlik:** AthliFi, sporcuya giden ana destekten **hiçbir komisyon almaz**. Protokol, gelecekte, bu "Destekçi Kartı" NFT'lerinin ikincil piyasalarda alınıp satılmasından doğacak %1-2 gibi çok küçük bir royalty ücreti ile kendi gelişimini finanse edebilir.

---

### **Bölüm 2: Teknik Mimari ve Sui Üzerindeki Uygulama**

AthliFi'nin devrimci vizyonu, yalnızca Sui'nin benzersiz mimari avantajları sayesinde bu kadar zarif, güvenli ve verimli bir şekilde hayata geçirilebilir.

#### **2.1. Neden Sui? Mimari Avantajlarımız**

1.  **Obje Modeli (Object Model):** Her sporcunun profili, zincir üzerinde doğrudan kendisine ait, bağımsız bir `AthlefiProfile` objesidir. Bu, dijital kimliğin ve verilerin tam mülkiyetini garanti eder.
2.  **Programlanabilir İşlem Blokları (PTBs):** Projemizin kalbi. Taraftarın destek olma eylemi – **SUI gönderme, NFT basma ve NFT'yi taraftara transfer etme** – tek, bölünemez ve atomik bir işlemde gerçekleşir. Bu, kullanıcı deneyimini sihirli bir şekilde basitleştirir ve her iki taraf için de riski sıfırlar.
3.  **Move Dili ve Yetki Deseni (Capability Pattern):** `MintCap` (NFT Basma Yetkisi) gibi hassas yetkileri, kopyalanamaz ve sadece ilgili profil tarafından kullanılabilir objeler olarak modelleyerek, protokolün güvenliğini en üst düzeye çıkarırız.

#### **2.2. On-Chain Mimarisi (Move Sözleşmeleri)**

**1. Veri Yapıları (`struct`'lar):**

*   `Link`: `{ label: String, url: String }`
*   `SupporterPassNFT`: `{ id: UID, athlete_profile_id: ID }`
*   `AthlefiProfile`: `{ id: UID, owner: address, name: String, ..., public_links: vector<Link>, donation_threshold: u64, exclusive_links: vector<Link> }`
*   `AdminCap` & `MintCap`: Protokol ve profil yönetimi için güvenlik anahtarları.

**2. Ana Fonksiyon (`athlefi_profile.move`):**

*   `donate_and_mint_pass(profile: &mut AthlefiProfile, donation: Coin<SUI>, ctx: &mut TxContext)`:
    1.  Gelen `donation` miktarının `profile.donation_threshold`'unu karşıladığını doğrular.
    2.  `donation`'ı sporcunun cüzdanına (`profile.owner`) transfer eder.
    3.  Profile özel `MintCap`'i kullanarak yeni bir `SupporterPassNFT` mintler.
    4.  Mintlenen NFT'yi taraftarın cüzdanına (`ctx.sender()`) transfer eder.

#### **2.3. Frontend Mimarisi (React & Walrus)**

*   **Teknoloji Yığını:** React (Vite), Mysten dApp Kit, Sui TypeScript SDK, **React Router**, Walrus, SuiNS.
*   **Merkeziyetsiz ve Dinamik Tek Sayfa Uygulaması (SPA):**
    1.  Tüm AthliFi platformunu içeren **tek bir React uygulaması** Walrus'a yüklenir ve `https://trwal.app` adresine bağlanır.
    2.  Bir kullanıcı `https://trwal.app/<sporcu-adi>` adresine gittiğinde, ana React uygulamamız yüklenir.
    3.  Uygulama içindeki **React Router**, URL'den `/sporcu-adi` yolunu yakalar.
    4.  Frontend, bu `sporcu-adi`'nı kullanarak, zincir üzerindeki merkezi "Kayıt Defteri" (Registry) objemizi sorgular ve sporcunun asıl `AthlefiProfile` objesinin ID'sini bulur.
    5.  Bu ID ile sporcunun herkese açık verileri (`public_links`, `donation_threshold` vb.) çekilir ve sayfanın temel iskeleti render edilir.
*   **Dinamik İçerik Kilidi (NFT-Gating):**
    1.  Kullanıcı cüzdanını bağladığında (`useCurrentAccount`), frontend ek bir sorgu daha yapar: "Bu cüzdan adresi, şu an görüntülenen profile ait bir `SupporterPassNFT`'ye sahip mi?"
    2.  Eğer cevap "Evet" ise, React uygulaması `AthlefiProfile` objesinden `exclusive_links` verisini de çeker ve sadece o kullanıcıya özel olarak ekranda gösterir.

### **Bölüm 3: Hackathon Yol Haritası ve Gelecek Vizyonu**

#### **3.1. Hackathon Hedefleri**

*   **Çalışan Prototip:**
    1.  Yukarıda tanımlanan Move sözleşmelerinin tamamlanması ve testnet'e dağıtılması.
    2.  Sporcular için profil, destek bedeli ve özel link oluşturma arayüzü.
    3.  Taraftarlar için dinamik profil görüntüleme ve PTB ile tek tıkla destek olma/NFT alma akışı.
    4.  Projenin `https://trwal.app/<profil-adi>` yapısıyla Walrus üzerinde çalışır hale getirilmesi.
*   **Bonus Hedefler (Kazanmak İçin):**
    *   **zkLogin Entegrasyonu:** Web2 kullanıcılarının (Google, Twitch vb.) seed phrase olmadan, doğrudan platforma katılıp destek olabilmesi.
    *   **Sponsorlu İşlemler:** Bir sporcuya ilk kez destek olan bir taraftarın işlem ücretini (gas fee) karşılayarak Web3'e giriş bariyerini tamamen ortadan kaldırmak.

#### **3.2. Gelecek Vizyonu**

*   **İç Çember DAO'ları:** "Destekçi Kartı" sahiplerinin, sporcunun kariyeriyle ilgili (forma rengi seçimi, bir sonraki turnuva lokasyonu vb.) küçük, eğlenceli kararlarda oy hakkına sahip olduğu mini-DAO'lar.
*   **Anlık Ödüller (Live Minting):** Bir sporcu yarışma sırasında önemli bir başarı elde ettiğinde (örneğin bir rekor kırdığında), o an canlı yayını izleyen "İç Çember" üyelerine özel, o anı ölümsüzleştiren bir "Kanıt" (Proof-of-Achievement) NFT'sinin airdrop ile dağıtılması.
*   **Takım ve Kulüp Entegrasyonları:** Protokolün sadece bireysel sporcular için değil, aynı zamanda yerel kulüpler ve takımlar için de bir topluluk finansman ve etkileşim aracına dönüştürülmesi.

### **Sonuç**

AthliFi, bir "link-in-bio" aracının çok ötesinde, bir ekonomik ve sosyal devrimdir. Sui'nin temel mimari gücünü kullanarak, sporcu ve taraftar arasındaki ilişkiyi aracısız, şeffaf ve karşılıklı olarak değerli bir hale getirir. Bu proje, sadece bir hackathon'u kazanma potansiyeline değil, aynı zamanda spor endüstrisinin tabanını sonsuza dek değiştirme vizyonuna sahiptir.