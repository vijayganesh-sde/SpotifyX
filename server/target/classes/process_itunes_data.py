import requests
import pandas as pd
import time

def crawl_itunes_by_language():
    languages = ['Tamil', 'Hindi', 'English', 'Telugu', 'Malayalam']
    limit_per_lang = 200 # Total per language (max iTunes allows is 200 per call)
    master_list = []

    print("🚀 Starting iTunes Metadata Crawl...")

    for lang in languages:
        print(f"Searching for {lang} hits...")
        # Search for songs in that language
        url = f"https://itunes.apple.com/search?term={lang}+songs&limit={limit_per_lang}&entity=song"
        
        try:
            response = requests.get(url).json()
            results = response.get('results', [])
            
            for track in results:
                # iTunes always provides a previewUrl, but we check just in case
                if 'previewUrl' in track:
                    master_list.append({
                        'track_id': track.get('trackId'),
                        'title': track.get('trackName'),
                        'artist': track.get('artistName'),
                        'album': track.get('collectionName'),
                        # Hack to get higher resolution image
                        'image_url': track.get('artworkUrl100', '').replace('100x100bb', '600x600bb'),
                        'preview_url': track.get('previewUrl'),
                        'language': lang,
                        'genre': track.get('primaryGenreName'),
                        'duration_ms': track.get('trackTimeMillis')
                    })
            
            print(f"✅ Added {len(results)} {lang} tracks.")
            time.sleep(0.5) # Be nice to the API
            
        except Exception as e:
            print(f"❌ Error fetching {lang}: {e}")

    # Save to CSV
    df = pd.DataFrame(master_list).drop_duplicates(subset=['track_id'])
    df.to_csv('itunes_master_dataset.csv', index=False)
    print(f"\n✨ Success! Created 'itunes_master_dataset.csv' with {len(df)} tracks.")

if __name__ == "__main__":
    crawl_itunes_by_language()