const tape = require('tape')
const AddonClient = require('stremio-addon-client')

const addonUrl = 'http://127.0.0.1:1222/manifest.json'
const testIh = '7782ab24188091eae3f61fd218b2dffb4bf9cf9c'
const testIhRecoginzed = '07a9de9750158471c3302e4e95edb1107f980fa6'

let addon

tape('initialize add-on', function(t) {
	return AddonClient.detectFromURL(addonUrl)
	.then(function(resp) {
		t.ok(resp, 'has response')
		t.ok(resp.addon, 'has addon')
		t.ok(resp.addon.manifest.catalogs, 'has catalogs')
		t.ok(resp.addon.manifest.catalogs.length, 'has catalogs length')
		t.ok(resp.addon.manifest.idPrefixes.includes('bt:'), 'idPrefixes has bt:')
		t.ok(resp.addon.manifest.idPrefixes.includes('local:'), 'idPrefixes has local:')

		addon = resp.addon

		t.end()
	})
	.catch(function(e) { 
		t.error(e)
		t.end()
	})

})

tape('catalog', function(t) {
	addon.get('catalog', addon.manifest.catalogs[0].type, addon.manifest.catalogs[0].id)
	.then(function(resp) {
		t.ok(Array.isArray(resp.metas), 'resp has metas')
		t.end()
	})
	.catch(function(e) { 
		t.error(e)
		t.end()
	})
})

tape('meta - bittorrent', function(t) {
	addon.get('meta', 'other', 'bt:'+testIh)		
	.then(function(resp) {
		t.ok(resp.meta, 'has meta')
		t.equals(resp.meta.id, 'bt:'+testIh, 'id is correct')
		t.ok(Array.isArray(resp.meta.videos), 'has videos')

		resp.meta.videos.forEach(function(vid) {
			t.ok(vid.stream, 'video has stream')
		})
		t.end()
	})
	.catch(function(e) {
		t.error(e)
		t.end()
	})
})


tape('meta - bittorrent - recognized item', function(t) {
	addon.get('meta', 'other', 'bt:'+testIhRecoginzed)		
	.then(function(resp) {
		t.ok(resp.meta, 'has meta')
		t.equals(resp.meta.type, 'series', 'recognized as series')
		t.equals(resp.meta.imdb_id, 'tt1748166', 'recognized as pioneer one')
		t.equals(resp.meta.name, 'Pioneer One')
		t.ok(Array.isArray(resp.meta.videos), 'has videos')

		t.end()
	})
	.catch(function(e) {
		t.error(e)
		t.end()
	})
})


// @TODO: stream resource test