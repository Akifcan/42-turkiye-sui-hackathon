graph TD
    subgraph "Ziyaretçinin Tarayıcısı (React Uygulaması)"
        A["<b>1. Ziyaretçi Adresi Yazar</b><br>Tarayıcıya `https://trwal.app/usain-bolt` girilir."]
        F["<b>5. Ana AthliFi Uygulaması Yüklenir</b><br>Tarayıcı, portaldan gelen ana React uygulamasını çalıştırır."]
        G["<b>6. React Router, URL'i Ayrıştırır</b><br>Adres çubuğundan 'usain-bolt' bilgisini yakalar."]
        J["<b>9. React, Sporcu Profilini Sorgular</b><br>Aldığı ID ile ikinci bir RPC isteği yapar: 'Bu ID'nin herkese açık verilerini getir.'"]
        K["<b>11. Sayfanın Herkese Açık Hali Oluşturulur</b><br>React, sporcunun genel verileriyle (bio, public_links, destek bedeli) sayfanın temelini çizer."]
        L{"<b>12. Ziyaretçi Cüzdanını Bağlar mı?</b>"}
        N["<b>14. React, Ziyaretçinin Cüzdanını Sorgular</b><br>RPC isteği: 'Bu cüzdanda, bu sporcuya ait bir <i>SupporterPassNFT</i> var mı?'"]
        P{"<b>NFT Bulundu mu?</b>"}
        Q["<b>✅ EVET: Sayfa Dönüşür ✅</b><br>React, sporcunun <i>exclusive_links</i> verisini de kullanarak<br>sadece destekçilere özel içerik bloklarını ekrana çizer."]
        R["<b>❌ HAYIR: Sayfa Aynı Kalır ❌</b><br>Ziyaretçi standart deneyime devam eder."]
    end

    subgraph "TRWal Portal (Ana Uygulama Sunucusu)"
        B["<b>2. İstek Portala Ulaşır</b><br>`trwal.app` sunucusu, ana dizine gelen isteği alır."]
        C["<b>3. Portal, Walrus'u Sorgular</b><br>Sabit olarak bildiği tek bir 'Ana AthliFi Site Objesi' ID'sinin dosyalarını ister."]
        E["<b>4. Portal, Ana Uygulama Dosyalarını Sunar</b><br>Walrus'tan aldığı genel React uygulamasının dosyalarını (HTML, JS, CSS) ziyaretçiye gönderir."]
    end

    subgraph "Sui Blockchain (On-Chain Veri Katmanı)"
        D["<b>Walrus Depolama (Blob'lar)</b><br>Ana AthliFi React uygulamasının kod dosyalarını saklar."]
        I["<b>Profil Kayıt Defteri Objesi (Registry)</b><br>Dynamic Fields kullanarak `sporcu-adi -> profil-objesi-id` eşleşmesini tutar."]
        H["<b>AthliFi Profil Objesi (Sporcuya Ait)</b><br>İçerik: public_links, exclusive_links, donation_threshold vb."]
        O["<b>Ziyaretçinin Cüzdanı</b><br>İçerik: SUI, NFT'ler (varsa SupporterPassNFT)"]
    end

    %% --- Akışın Adımları ---

    %% Adım 1-5: Ana Uygulamanın Yüklenmesi
    A --> B --> C --> D
    D -- "<b>3a. Ana Uygulama Dosyalarını Döndürür</b>" --> E
    E --> F

    %% Adım 6-11: Sporcu Profilinin Keşfi ve İlk Render
    F --> G
    G -- "<b>7. React, RPC üzerinden Kayıt Defteri'ni sorgular</b><br>'usain-bolt' hangi Profil ID'sine ait?" --> I
    I -- "<b>8. Profil Objesi ID'sini (`0x123...`) Döndürür</b>" --> J
    J --> H
    H -- "<b>10. Herkese Açık Profil Verilerini Döndürür</b>" --> K

    %% Adım 12-18: Dinamik İçerik Kilidinin Açılması (NFT-Gating)
    K --> L
    L -- "Evet" --> N
    N --> O
    O -- "<b>15. Cüzdan İçeriğini Döndürür</b>" --> P
    P -- "Evet" --> Q
    P -- "Hayır" --> R