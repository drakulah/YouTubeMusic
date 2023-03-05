// https://krcs.kugou.com/search?ver=1&man=yes&client=mobi&keyword=Atif%20Aslam%20-%20Tu%20Chahiye
const search = {
  "status": 200,
  "info": "OK",
  "errcode": 200,
  "errmsg": "OK",
  "keyword": "Atif Aslam - Tu Chahiye",
  "proposal": "22969536",
  "has_complete_right": 0,
  "companys": "",
  "ugc": 0,
  "ugccount": 0,
  "expire": 43200,
  "candidates": [
    {
      "id": "22969536",
      "product_from": "第三方歌词",
      "accesskey": "76558AD96F124D2A6F9648CE5C25B21C",
      "can_score": false,
      "singer": "Atif Aslam",
      "song": "Tu Chahiye",
      "duration": 272994,
      "uid": "486948851",
      "nickname": "热心用户",
      "origiuid": "0",
      "transuid": "0",
      "sounduid": "0",
      "originame": "",
      "transname": "",
      "soundname": "",
      "parinfo": [],
      "parinfoExt": [],
      "language": "",
      "krctype": 2,
      "hitlayer": 7,
      "hitcasemask": 12,
      "adjust": 0,
      "score": 60,
      "contenttype": 0
    }
  ],
  "ugccandidates": [],
  "artists": [],
  "ai_candidates": []
}
// https://krcs.kugou.com/download?ver=1&man=yes&client=pc&accesskey=76558AD96F124D2A6F9648CE5C25B21C&id=22969536&fmt=lrc
const info = {
  "content": "77u/W2lkOiQwMDAwMDAwMF0NClthcjpBdGlmIEFzbGFtXQ0KW3RpOlR1IENoYWhpeWUgKOOAiuWwj+iQneiOieeahOeMtOelnuWkp+WPlOOAi+eUteW9seaPkuabsildDQpbYnk6XQ0KW2hhc2g6YzBkODZkMWZlNjM4NzhlY2NjZmRjMGYzN2ZmMGRkMGRdDQpbYWw6XQ0KW3NpZ246XQ0KW3FxOl0NClt0b3RhbDowXQ0KW29mZnNldDowXQ0KWzAwOjAwLjE2XUF0aWYgQXNsYW0gLSBUdSBDaGFoaXllDQpbMDA6MDAuODJdKOOAiuWwj+iQneiOieeahOeMtOelnuWkp+WPlOOAi+eUteW9seaPkuabsikNClswMDoxNC44OV1IYWFsIGUgZGlsIGtvIHN1a29vbiBjaGFoaXllDQpbMDA6MjIuMjJdUG9vcmkgaWsgYWFyem9vIGNoYWhpeWUNClswMDoyOC44NV1KYWlzZSBwZWhsZSBrYWJoaSBrdWNoIGJoaSBjaGFhaGEgbmFoaQ0KWzAwOjM2LjM1XVdhaXNlIGhpIGt5dW4gY2hhaGl5ZQ0KWzAwOjQyLjcxXURpbCBrbyB0ZXJpIG1vam9vZGdpIGthIGVoc2FhcyB5dW4gY2hhaGl5ZQ0KWzAwOjQ5LjYxXVR1IGNoYWhpeWUgdHUgY2hhaGl5ZQ0KWzAwOjUzLjUzXVNoYWFtIG8gc3ViYWggdHUgY2hhaGl5ZQ0KWzAwOjU3LjA1XVR1IGNoYWhpeWUgdHUgY2hhaGl5ZQ0KWzAxOjAwLjY1XUhhciBtYXJ0YWJhYSB0dSBjaGFoaXllDQpbMDE6MDQuMTZdSml0bmkgZGFmYWEgemlkZCBobyBtZXJpDQpbMDE6MTEuMzNdVXRuaSBkYWZhYSBoYWFuIHR1IGNoYWhpeWUNClswMToxOC44OV1XbyBvDQpbMDE6MjIuMzVdV28gb28NClswMTo1OC44N11Lb2kgYXVyIGRvb2phIGt5dW4gbXVqaGUNClswMjowNC4wMF1OYSB0ZXJlIHNpdmEgY2hhaGl5ZQ0KWzAyOjA3LjA3XUhhciBzYWZhciBtZWluIG11amhlDQpbMDI6MTEuMTldVHUgaGkgcmVobnVtYSBjaGFoaXllDQpbMDI6MTQuMzRdSmVlbmUga28gYmFzIG11amhlDQpbMDI6MTguMzVdVHUgaGkgbWVoZXJiYWFuIGNoYWhpeWUNClswMjoyMi4zN11Ibw0KWzAyOjIzLjgzXVNlZW5lIG1laW4gYWdhciB0dSBkYXJkIGhhaQ0KWzAyOjI5LjAzXU5hIGtvaSBkYXdhYSBjaGFoaXllDQpbMDI6MzIuMzBdVHUgbGFodSBraSB0YXJhaA0KWzAyOjM2LjE4XVJhZ29uIG1laW4gcmF3YWFuIGNoYWhpeWUNClswMjozOS40NF1BbmphYW0gam8gY2hhYWhlIG1lcmEgaG8NClswMjo0NC4wMF1BYWdhYXogeXVuIGNoYWhpeWUNClswMjo0Ni4yN11UdSBjaGFoaXllIHR1IGNoYWhpeWUNClswMjo0OS44Nl1TaGFhbSBvIHN1YmFoIHR1IGNoYWhpeWUNClswMjo1My40MV1UdSBjaGFoaXllIHR1IGNoYWhpeWUNClswMjo1Ny4wNV1IYXIgbWFydGFiYWEgdHUgY2hhaGl5ZQ0KWzAzOjAwLjYwXUppdG5pIGRhZmFhIHppZGQgaG8gbWVyaQ0KWzAzOjA3LjgyXVV0bmkgZGFmYWEgaGFhbiB0dSBjaGFoaXllDQpbMDM6MTUuMjVdV28gbw0KWzAzOjE4Ljc5XVdvIG9vDQpbMDM6MjkuMzZdTWVyZSB6YWtobW9uIGtvIHRlcmkgY2hodWFuIGNoYWhpeWUNClswMzozNi4zMl1NZXJpIHNoYW1tYSBrbyB0ZXJpIGFnYW4gY2hhaGl5ZQ0KWzAzOjQ0LjM0XU1lcmUga2h3YWFiIGtlIGFhc2hpeWFuZSBtZWluIHR1IGNoYWhpeWUNClswMzo1MS4zMl1NYWluIGtob2x1biBqbyBhYW5raGVpbiBzaXJoYW5lIGJoaSB0dSBjaGFoaXllDQpbMDM6NTguMDddV28gaG8NClswNDowMi4wMV1XbyBobyBobw0K",
  "info": "OK",
  "fmt": "lrc",
  "error_code": 0,
  "_source": "bss",
  "contenttype": 1,
  "status": 200,
  "charset": "utf8"
}
/**
ï»¿[id:$00000000]
[ar:Atif Aslam]
[ti:Tu Chahiye (ã\x80\x8aå°\x8fè\x90\x9dè\x8e\x89ç\x9a\x84ç\x8c´ç¥\x9eå¤§å\x8f\x94ã\x80\x8bç\x94µå½±æ\x8f\x92æ\x9b²)]
[by:]
[hash:c0d86d1fe63878ecccfdc0f37ff0dd0d]
[al:]
[sign:]
[qq:]
[total:0]
[offset:0]
[00:00.16]Atif Aslam - Tu Chahiye
[00:00.82](ã\x80\x8aå°\x8fè\x90\x9dè\x8e\x89ç\x9a\x84ç\x8c´ç¥\x9eå¤§å\x8f\x94ã\x80\x8bç\x94µå½±æ\x8f\x92æ\x9b²)
[00:14.89]Haal e dil ko sukoon chahiye
[00:22.22]Poori ik aarzoo chahiye
[00:28.85]Jaise pehle kabhi kuch bhi chaaha nahi
[00:36.35]Waise hi kyun chahiye
[00:42.71]Dil ko teri mojoodgi ka ehsaas yun chahiye
[00:49.61]Tu chahiye tu chahiye
[00:53.53]Shaam o subah tu chahiye
[00:57.05]Tu chahiye tu chahiye
[01:00.65]Har martabaa tu chahiye
[01:04.16]Jitni dafaa zidd ho meri
[01:11.33]Utni dafaa haan tu chahiye
[01:18.89]Wo o
[01:22.35]Wo oo
[01:58.87]Koi aur dooja kyun mujhe
[02:04.00]Na tere siva chahiye
[02:07.07]Har safar mein mujhe
[02:11.19]Tu hi rehnuma chahiye
[02:14.34]Jeene ko bas mujhe
[02:18.35]Tu hi meherbaan chahiye
[02:22.37]Ho
[02:23.83]Seene mein agar tu dard hai
[02:29.03]Na koi dawaa chahiye
[02:32.30]Tu lahu ki tarah
[02:36.18]Ragon mein rawaan chahiye
[02:39.44]Anjaam jo chaahe mera ho
[02:44.00]Aagaaz yun chahiye
[02:46.27]Tu chahiye tu chahiye
[02:49.86]Shaam o subah tu chahiye
[02:53.41]Tu chahiye tu chahiye
[02:57.05]Har martabaa tu chahiye
[03:00.60]Jitni dafaa zidd ho meri
[03:07.82]Utni dafaa haan tu chahiye
[03:15.25]Wo o
[03:18.79]Wo oo
[03:29.36]Mere zakhmon ko teri chhuan chahiye
[03:36.32]Meri shamma ko teri agan chahiye
[03:44.34]Mere khwaab ke aashiyane mein tu chahiye
[03:51.32]Main kholun jo aankhein sirhane bhi tu chahiye
[03:58.07]Wo ho
[04:02.01]Wo ho ho

 */