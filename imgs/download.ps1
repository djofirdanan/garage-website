$dest = "D:\website-claude\garage\imgs"
$base = "https://garage.org.il/wp-content/uploads"

$images = @(
  # Hero banner - all products with smoke
  @{ url = "$base/2024/05/%D7%91%D7%90%D7%A0%D7%A8-%D7%9E%D7%A4%D7%99%D7%A6%D7%99%D7%9D-%D7%90%D7%95%D7%93%D7%99-%D7%9B%D7%9C%D7%9C%D7%993.png"; name = "hero-banner.png" },

  # Product images - diffusers clean (no background)
  @{ url = "$base/2024/04/%D7%9E%D7%A4%D7%99%D7%A5-2-%D7%A0%D7%A7%D7%99.png"; name = "g30-diffuser.png" },
  @{ url = "$base/2024/04/%D7%9E%D7%A4%D7%99%D7%A5-4-%D7%A0%D7%A7%D7%99.png"; name = "g60-diffuser.png" },
  @{ url = "$base/2024/04/%D7%9E%D7%A4%D7%99%D7%A5-6-%D7%A0%D7%A7%D7%99.png"; name = "s600-diffuser.png" },
  @{ url = "$base/2023/11/%D7%9E%D7%A4%D7%99%D7%A5-8-%D7%A0%D7%A7%D7%99.png"; name = "s800-diffuser.png" },
  @{ url = "$base/2024/04/%D7%9E%D7%A4%D7%99%D7%A5-11-%D7%A0%D7%A7%D7%99.png"; name = "g100-diffuser.png" },
  @{ url = "$base/2024/04/%D7%90%D7%99%D7%A8%D7%A7%D7%95%D7%9C%D7%A1-%D7%9C%D7%A8%D7%9B%D7%91-%D7%A0%D7%A7%D7%99.png"; name = "aircules-car.png" },
  @{ url = "$base/2024/04/G100-%D7%9C%D7%91%D7%9F.png"; name = "g100-white.png" },
  @{ url = "$base/2024/04/G100-%D7%A9%D7%97%D7%95%D7%A8.png"; name = "g100-black.png" },
  @{ url = "$base/2023/09/S-300.png"; name = "s300-diffuser.png" },
  @{ url = "$base/2023/05/%D7%9E%D7%A4%D7%99%D7%A5-300-%D7%A0%D7%A7%D7%99-%D7%A2%D7%9D-%D7%91%D7%A7%D7%91%D7%95%D7%A7-%D7%9E%D7%AA%D7%A0%D7%94.png"; name = "s300-with-bottle.png" },

  # Fragrance bottles
  @{ url = "$base/2022/06/3-%D7%91%D7%A7%D7%91%D7%95%D7%A7%D7%99%D7%9D-%D7%92%D7%93%D7%95%D7%9C%D7%99%D7%9D-%D7%A0%D7%A7%D7%99.png"; name = "bottles-3-large.png" },
  @{ url = "$base/2024/04/%D7%91%D7%A7%D7%91%D7%95%D7%A7%D7%99-%D7%A8%D7%99%D7%97-%D7%9C%D7%9E%D7%99%D7%9C%D7%95%D7%99-1.png"; name = "bottles-refill.png" },
  @{ url = "$base/2022/06/%D7%91%D7%A7%D7%91%D7%95%D7%A7-%D7%9C%D7%9E%D7%A4%D7%99%D7%A5-%D7%94%D7%92%D7%93%D7%95%D7%9C_compressed.jpg"; name = "bottle-large.jpg" },
  @{ url = "$base/2025/07/6-%D7%91%D7%A7%D7%91%D7%95%D7%A7%D7%99%D7%9D-%D7%A0%D7%A7%D7%99-%D7%9C%D7%93%D7%A3-%D7%91%D7%90%D7%A0%D7%93%D7%9C-copy.webp"; name = "bottles-6-bundle.webp" },

  # Bundle product
  @{ url = "$base/2025/07/%D7%91%D7%90%D7%A0%D7%93%D7%9C-%D7%9E%D7%A4%D7%99%D7%A5-copy.webp"; name = "bundle-product.webp" },

  # Category banners
  @{ url = "$base/2024/04/%D7%91%D7%90%D7%A0%D7%A8-%D7%9B%D7%A4%D7%AA%D7%95%D7%A8-%D7%9E%D7%A4%D7%99%D7%A6%D7%99%D7%9D-%D7%9C%D7%91%D7%99%D7%AA-%D7%95%D7%9C%D7%9E%D7%A9%D7%A8%D7%93.png"; name = "cat-home-office.png" },
  @{ url = "$base/2024/04/%E2%80%8F%E2%80%8F%D7%91%D7%90%D7%A0%D7%A8-%D7%9B%D7%A4%D7%AA%D7%95%D7%A8-%D7%9E%D7%A4%D7%99%D7%A6%D7%99%D7%9D-%D7%9C%D7%A8%D7%9B%D7%91.png"; name = "cat-car.png" },
  @{ url = "$base/2024/04/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8F%D7%91%D7%90%D7%A0%D7%A8-%D7%9B%D7%A4%D7%AA%D7%95%D7%A8-%D7%9E%D7%A4%D7%99%D7%A6%D7%99%D7%9D-%D7%9C%D7%A2%D7%A1%D7%A7-%D7%97%D7%A0%D7%95%D7%AA.png"; name = "cat-business.png" },

  # Lifestyle photos
  @{ url = "$base/2023/09/%D7%A4%D7%AA%D7%A8%D7%95%D7%A0%D7%95%D7%AA-%D7%A8%D7%99%D7%97-%D7%9E%D7%AA%D7%A7%D7%93%D7%9E%D7%99%D7%9D-%D7%90%D7%95%D7%93%D7%99.png"; name = "lifestyle-solutions.png" },
  @{ url = "$base/2023/09/%D7%9E%D7%9B%D7%A9%D7%99%D7%A8-removebg-preview.png"; name = "device-no-bg.png" },
  @{ url = "$base/2023/05/%D7%A9%D7%97%D7%95%D7%A8-%D7%90%D7%95-%D7%9C%D7%91%D7%9F.png"; name = "black-or-white.png" },

  # Perfume/fragrance oils
  @{ url = "$base/2024/03/%D7%91%D7%95%D7%A9%D7%9D-%D7%A9%D7%9E%D7%9F-%D7%9C%D7%92%D7%91%D7%A8-%D7%95%D7%9C%D7%90%D7%99%D7%A9%D7%94.jpg"; name = "perfume-oil.jpg" },

  # Other products
  @{ url = "$base/2025/11/%D7%9E%D7%91%D7%A9%D7%9D-%D7%9B%D7%91%D7%99%D7%A1%D7%94-%D7%9E%D7%A8%D7%95%D7%9B%D7%96.png"; name = "laundry-concentrate.png" },
  @{ url = "$base/2026/02/%D7%A7%D7%A8%D7%9D-%D7%99%D7%93%D7%99%D7%99%D7%9D-%D7%A0%D7%A7%D7%991.png"; name = "hand-cream.png" },
  @{ url = "$base/2026/02/%D7%A7%D7%A8%D7%9D-%D7%99%D7%93%D7%99%D7%99%D7%9D-%D7%A2%D7%9D-%D7%A8%D7%A7%D7%A2-1.png"; name = "hand-cream-bg.png" },

  # Environment photos
  @{ url = "$base/2023/11/WhatsApp-Image-2023-11-29-at-07.46.41-1.jpeg"; name = "env-office-1.jpg" },
  @{ url = "$base/2023/11/WhatsApp-Image-2023-11-29-at-07.46.41.jpeg"; name = "env-office-2.jpg" },
  @{ url = "$base/2024/04/WhatsApp-Image-2024-04-09-at-17.27.20-1.jpeg"; name = "env-install-1.jpg" },
  @{ url = "$base/2024/04/WhatsApp-Image-2024-04-09-at-17.27.20.jpeg"; name = "env-install-2.jpg" },
  @{ url = "$base/2024/04/WhatsApp-Image-2024-04-09-at-17.27.19.jpeg"; name = "env-install-3.jpg" },
  @{ url = "$base/2023/05/WhatsApp-Image-2023-06-21-at-09.30.361.jpeg"; name = "env-lifestyle-1.jpg" },
  @{ url = "$base/2023/05/WhatsApp-Image-2023-06-20-at-09.27.41.jpeg"; name = "env-lifestyle-2.jpg" }
)

$success = 0
$fail = 0

foreach ($img in $images) {
  $outPath = Join-Path $dest $img.name
  try {
    Invoke-WebRequest -Uri $img.url -OutFile $outPath -UseBasicParsing -ErrorAction Stop
    $size = (Get-Item $outPath).Length
    if ($size -gt 1000) {
      Write-Host "OK  $($img.name) ($([math]::Round($size/1024))KB)"
      $success++
    } else {
      Write-Host "SMALL $($img.name) (${size}B) - might be error"
      $fail++
    }
  } catch {
    Write-Host "FAIL $($img.name): $_"
    $fail++
  }
}

Write-Host ""
Write-Host "Done: $success ok, $fail failed"
