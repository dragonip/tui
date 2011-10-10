SOURCES="../app/*/*.js js/*/*.js"
BUILDDIR="../build/"

echo "<html><head><title>Docs</title><link href='docs.css' rel='stylesheet' type='text/css' /><script src='docs.js' type='text/javascript'></script></head><body><div id='content'>" > newdoc.html
cat ${SOURCES} | sed -n -e 's/.*\(@module\)\(.*\)/<p class="module">\2<\/p>/p' -e 's/.*\(@method\)\( *\)\([^ ]*\)\(.*\)/<div class="method">\3<p class="methoddescription">\4<\/p><\/div>/p'  -e 's/.*\(@param\)\(.*\)/<div class="params">\2<\/div>/p' >> newdoc.html
echo "</div></body></html>" >> newdoc.html
mv newdoc.html docs/index.html
