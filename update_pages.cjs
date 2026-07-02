const fs = require('fs');

const pages = [
  'src/pages/donor/ProfilePage.jsx',
  'src/pages/donor/CreateRequestPage.jsx',
  'src/pages/donor/MyRequestsPage.jsx',
  'src/pages/public/BlogPage.jsx',
  'src/pages/public/BlogPostPage.jsx'
];

pages.forEach(page => {
  let content = fs.readFileSync(page, 'utf8');
  if (content.includes('ModernHeader')) return;

  let title = "Page";
  if (page.includes('ProfilePage')) title = 'My Profile';
  if (page.includes('CreateRequestPage')) title = 'Request Blood';
  if (page.includes('MyRequestsPage')) title = 'My Requests';
  if (page.includes('BlogPage')) title = 'Blog';
  if (page.includes('BlogPostPage')) title = 'Article';

  const importStatement = "import ModernHeader from '../../components/ModernHeader';\nimport { MobileBottomNav } from '../../components/Navbar';\n";
  
  // prepend import
  content = importStatement + "\n" + content;
  
  // replace the first return ( <div ... >
  let replacedFirst = false;
  content = content.replace(/return\s*\(\s*(<div[^>]*>)/, (match, p1) => {
    if (replacedFirst) return match;
    replacedFirst = true;
    return "return (\n    <div className=\"min-h-screen bg-[#FDFDFD] pb-24 md:pb-10 font-sans\">\n      <ModernHeader title=\"" + title + "\" />\n      " + p1;
  });

  // replace the last </div> ); }
  content = content.replace(/<\/div>\s*\);\s*}\s*$/, match => {
    return "      <MobileBottomNav />\n    </div>\n" + match;
  });

  fs.writeFileSync(page, content);
  console.log('Updated ' + page);
});
