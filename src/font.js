const _fontLoader = {}

_fontLoader.loadFonts = () => {
  if (!window.Typekit) {
    window.Typekit = {}
  }
  window.Typekit.config = {
    'a': '399095',
    'c': ['.tk-proxima-nova-condensed', '\'proxima-nova-condensed\',sans-serif', '.tk-ff-meta-serif-web-pro', '\'ff-meta-serif-web-pro\',serif', '.tk-lato', '\'lato\',sans-serif'],
    'fi': [149, 5022, 5035, 5178, 5310, 15700, 15708],
    'fc': [{
      'id': 149,
      'family': 'proxima-nova-condensed',
      'src': 'https://use.typekit.net/af/20c168/000000000000000000017837/27/{format}{?primer,subset_id,fvd,v}',
      'descriptors': {
        'weight': '600',
        'style': 'normal',
        'subset_id': 2
      }
    }, {
      'id': 5022,
      'family': 'ff-meta-serif-web-pro',
      'src': 'https://use.typekit.net/af/88b36c/000000000000000000016649/27/{format}{?primer,subset_id,fvd,v}',
      'descriptors': {
        'weight': '500',
        'style': 'italic',
        'subset_id': 2
      }
    }, {
      'id': 5035,
      'family': 'ff-meta-serif-web-pro',
      'src': 'https://use.typekit.net/af/209b72/000000000000000000016647/27/{format}{?primer,subset_id,fvd,v}',
      'descriptors': {
        'weight': '700',
        'style': 'italic',
        'subset_id': 2
      }
    }, {
      'id': 5178,
      'family': 'ff-meta-serif-web-pro',
      'src': 'https://use.typekit.net/af/06a536/000000000000000000016646/27/{format}{?primer,subset_id,fvd,v}',
      'descriptors': {
        'weight': '700',
        'style': 'normal',
        'subset_id': 2
      }
    }, {
      'id': 5310,
      'family': 'ff-meta-serif-web-pro',
      'src': 'https://use.typekit.net/af/7b626e/000000000000000000016648/27/{format}{?primer,subset_id,fvd,v}',
      'descriptors': {
        'weight': '500',
        'style': 'normal',
        'subset_id': 2
      }
    }, {
      'id': 15700,
      'family': 'lato',
      'src': 'https://use.typekit.net/af/50d55e/000000000000000000015235/27/{format}{?primer,subset_id,fvd,v}',
      'descriptors': {
        'weight': '900',
        'style': 'normal',
        'subset_id': 2
      }
    }, {
      'id': 15708,
      'family': 'lato',
      'src': 'https://use.typekit.net/af/180254/00000000000000000001522c/27/{format}{?primer,subset_id,fvd,v}',
      'descriptors': {
        'weight': '400',
        'style': 'normal',
        'subset_id': 2
      }
    }],
    'fn': ['ff-meta-serif-web-pro', ['i5', 'i7', 'n5', 'n7'], 'lato', ['n4', 'n9'], 'proxima-nova-condensed', ['n6']],
    'hn': 'use.typekit.net',
    'ht': 'tk',
    'js': '1.19.2',
    'kt': 'quu2bck',
    'l': 'typekit',
    'ps': 1,
    'ping': 'https://p.typekit.net/p.gif{?s,k,ht,h,f,a,js,app,e,_}',
    'pm': true,
    'type': 'configurable',
    'vft': false
  }
}
export default _fontLoader
