import os
from datetime import datetime
from bs4 import BeautifulSoup

def process_post(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        h2 = soup.find('h2')
        date_div = soup.find('div', class_='date')
        
        if h2 and date_div:
            title = h2.text.strip()
            try:
                date = datetime.strptime(date_div.text.strip(), '%Y-%m-%d')
                paragraphs = soup.find_all('p')
                excerpt = ''
                count = 0
                for p in paragraphs:
                    if not p.find('img'):
                        excerpt += p.text.strip() + '\n\n'
                        count += 1
                        if count == 2:
                            break
                return {
                    'title': title,
                    'date': date,
                    'excerpt': excerpt.strip(),
                    'filename': os.path.basename(file_path)
                }
            except ValueError:
                print(f"Invalid date format in {file_path}")
    return None

def update_index(newest_post):
    print("Updating index.html...")
    with open('index.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    main = soup.find('main')
    if main:
        existing_articles = main.find_all('article')
        
        new_article = soup.new_tag('article')
        h2 = soup.new_tag('h2')
        a = soup.new_tag('a', href=f"/blog/{newest_post['filename']}")
        a.string = newest_post['title']
        h2.append(a)
        new_article.append(h2)
        
        date_div = soup.new_tag('div', attrs={'class': 'date'})
        date_div.string = newest_post['date'].strftime('%Y-%m-%d')
        new_article.append(date_div)
        
        for paragraph in newest_post['excerpt'].split('\n\n'):
            p = soup.new_tag('p')
            p.string = paragraph
            new_article.append(p)
        
        p_more = soup.new_tag('p')
        a_more = soup.new_tag('a', href=f"/blog/{newest_post['filename']}")
        a_more.string = 'more...'
        p_more.append(a_more)
        new_article.append(p_more)
        
        main.clear()
        main.append(new_article)
        for article in existing_articles[:4]:
            main.append(article)
        
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(str(soup.prettify()))
        print("Updated index.html successfully!")

def update_all_page(newest_post):
    print("\nUpdating all page...")
    # Print current working directory and list files
    print(f"Current directory: {os.getcwd()}")
    print("Files in current directory:", os.listdir())
    
    try:
        with open('all', 'r', encoding='utf-8') as f:  # Just use 'all' as the filename
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        ul = soup.find('ul')
        if ul:
            li = soup.new_tag('li')
            a = soup.new_tag('a', href=f"/blog/{newest_post['filename']}")
            
            title_div = soup.new_tag('div', attrs={'class': 'title'})
            title_div.string = newest_post['title']
            a.append(title_div)
            
            date_div = soup.new_tag('div', attrs={'class': 'date'})
            date_div.string = newest_post['date'].strftime('%Y-%m-%d')
            a.append(date_div)
            
            li.append(a)
            ul.insert(0, li)
            
            with open('all', 'w', encoding='utf-8') as f:
                f.write(str(soup.prettify()))
            print("Updated all page successfully!")
    except Exception as e:
        print(f"Error updating all page: {str(e)}")
        raise

def main():
    posts = []
    for file in os.listdir('blog'):
        if file.startswith('.') or file == 'all':
            continue
        
        file_path = os.path.join('blog', file)
        post = process_post(file_path)
        if post:
            posts.append(post)
    
    if posts:
        newest_post = max(posts, key=lambda x: x['date'])
        print(f"\nNewest post: {newest_post['title']} ({newest_post['date'].strftime('%Y-%m-%d')})")
        
        response = input("Update index and all pages with this post? (yes/no): ")
        if response.lower() == 'yes':
            update_index(newest_post)
            update_all_page(newest_post)

if __name__ == "__main__":
    main()