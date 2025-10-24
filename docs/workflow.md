graph TD
    subgraph "Sporcunun Kurulumu (Daha Basit)"
        A["<b>1. Sporcu, AthliFi Profilini Oluşturur</b>"]
        B["<b>2. Destek Şartlarını Belirler</b><br>- Destekçi olmak için gereken SUI miktarını girer.<br>- Sadece destekçilere özel linkleri ekler."]
        A --> B
    end

    subgraph "Taraftarın Yolculuğu (Daha Net)"
        C["<b>1. Taraftar, sporcunun <sporcu>.trwal.app sayfasına gider.</b>"]
        D["<b>2. Herkese açık içeriği ve 'İç Çembere Katıl' çağrısını görür.</b>"]
        E{"<b>Destekçi Olmak İster mi?</b>"}
        
        C --> D --> E

        E -- "Hayır" --> F["<b>Taraftar sadece herkese açık<br>linkleri kullanır. Döngü biter.</b>"]
        E -- "Evet ('Katıl' düğmesine tıklar)" --> G

        G["<b>3. 'Destek Ol' düğmesi, PTB'yi tetikler.</b>"]
        
        subgraph "<b>4. Atomik İşlem Bloğu (PTB)</b>"
            direction LR
            P1["<b>Cmd 1:</b><br>Gerekli SUI'yi taraftarın cüzdanından ayır."]
            P2["<b>Cmd 2:</b><br>SUI'yi sporcuya gönder,<br>'SupporterPassNFT'yi mintle."]
            P3["<b>Cmd 3:</b><br>Yeni NFT'yi taraftarın cüzdanına gönder."]
            P1 --> P2 --> P3
        end
        
        G --> P1
        
        H["<b>5. Taraftar, artık bir 'SupporterPassNFT' sahibidir.</b>"]
        P3 --> H

        I["<b>6. Taraftar sayfayı tekrar ziyaret eder veya cüzdanını bağlar.</b>"]
        H --> I

        J["<b>7. Frontend, taraftarın cüzdanını okur.</b>"]
        I --> J

        K{"<b>Cüzdanda 'SupporterPassNFT' var mı?</b>"}
        J --> K

        L["<b>✅ Evet: İç Çember İçeriği Gösterilir ✅</b><br>Frontend, sadece NFT sahiplerinin<br>görebileceği özel linkleri ve içerikleri render eder."]
        M["<b>❌ Hayır: Standart İçerik Gösterilir ❌</b><br>Frontend, herkese açık<br>olan standart linkleri render eder."]
        
        K -- "Evet" --> L
        K -- "Hayır" --> M
    end