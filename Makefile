deploy: 
	yarn pre-deploy
	yarn publish --access public

docs-upload: 
	s3cmd sync docs/* s3://vortex-developers/docs/jsvortex/
	aws cloudfront create-invalidation --distribution-id E14G85YHOYJ3NL --paths "/docs/jsvortex/*"
