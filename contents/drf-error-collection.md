---
date: '2021-10-11'
title: '[velog 이전] DRF 에러 해결 모음집'
categories: ['Web', 'Back-end', 'Choice']
summary: 'DRF 에러 중 Heroku static, media file serving, Nested serializers, name already exists, Moved Permanently 등에 대해 알아본다'
thumbnail: './drf-error-collection/main.png'
---
*해당 글은 과거 **velog**에 쓴 글을 다듬어서 이전한 글입니다. 원본은 [**링크1**](https://velog.io/@hdyang0686/DRF-%EB%82%9C%EC%A4%91%EC%9D%BC%EA%B8%B0), [**링크2**](https://velog.io/@hdyang0686/DRF-%EB%82%9C%EC%A4%91%EC%9D%BC%EA%B8%B0-2)를 참조하시기 바랍니다.*  
\
이번 글에선 DRF를 사용하며 겪었던 여러 오류들을 정리해보려 합니다.  
~~여러분은 저처럼 삽질하지 맙시다~~

## 1. Nested serializers의 required=False 설정

보통 DRF에서 모델을 작성한 후, required를 설정하면 다음처럼 적용하게 됩니다.

**models.py**
```py
class Mentoring(AbstractTimeStampModel):
    ...
    thumbnail=models.ImageField(null=True, blank=True)
```
**serializers.py**
```py
extra_kwargs = {
    'thumbnail': {'required': False}
}
```

하지만 Nested serializers(외부 앱)를 적용하면 얘기가 달라집니다.
꼭 다음과 같이 extra_kwargs에 넣지 말고 따로 작성해서 삽질하는 일이 없도록 합시다. 

**models.py**
```py
class Mentoring(AbstractTimeStampModel):
    ...
    tags=models.ManyToManyField(Tag)
```
**serializers.py**
```py
class MentoringSerializer(serializers.HyperlinkedModelSerializer):
    ...
    tags = TagSerializer(required=False)
```


## 2. ~ with this name already exists.

 **serializers.py(mentoring)**
```py
class MentoringSerializer(serializers.HyperlinkedModelSerializer):
    tags = TagSerializer(many=True)
    ...
    def create(self, validated_data):
        tags_data=validated_data.pop('tags')
        ...
        for tag_data in tags_data:
            tag, created= Tag.objects.get_or_create(**tag_data)
            mentoring.tags.add(tag)
        return mentoring
```
**models.py(tag)**
```py
class Tag(AbstractTimeStampModel):
    name=models.CharField(max_length=16, unique=True)
```

위의 코드는 metoring 모델의 serializers에서 tag라는 nested serializers 를 불러와 외래 키로써 사용하는 예시입니다. 여기서 만약 tag의 name이 원래 있던 것과 중복된다면, `tag, created= Tag.objects.get_or_create(**tag_data)` 를 쓰기도 전에 `def create(self, validated_data):` 에서 막혀버립니다.  

```py
HTTP/1.1 400 Bad Request
Date: Sun, 03 Oct 2021 07:06:07 GMT
Server: WSGIServer/0.2 CPython/3.9.6
Content-Type: application/json
Vary: Accept
Allow: GET, POST, HEAD, OPTIONS
X-Frame-Options: DENY
Content-Length: 58
X-Content-Type-Options: nosniff
Referrer-Policy: same-origin
{
  "tags": [
    {
      "name": [
        "tag with this name already exists."
      ]
    }
  ]
}
```
이를 해결하기 위해서는 tag의 `validated_data` 과정에서 예외를 처리해주면 됩니다.  
**serializers.py(tag)**
```py
class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = []
        extra_kwargs = {
            'name': {'validators': []},
        }
```

## 3. 슬래시 / 와 301 Moved Permanently

Django에서 라우트 설정을 하다 보면 / 를 넣을지 말지 고민하는 경우가 있습니다. 각 경우에 대해 나타나는 현상을 정리하면 다음과 같습니다.

**(1) / 를 빼는 경우**
```py
from django.urls import path, include
from .views import  LogoutAPI, RegistrationAPI, LoginAPI, UserAPI
urlpatterns =[
    path("register", RegistrationAPI.as_view()),
    path("login", LoginAPI.as_view()),
    path("user", UserAPI.as_view()),
    path("logout", LogoutAPI.as_view()),
]
```
auth/register 로 접근 시 => **정상 접속**  
auth/register/ 로 접근 시 => **404 에러**  
\
**(2) / 를 넣는 경우**
```py
from django.urls import path, include
from .views import  LogoutAPI, RegistrationAPI, LoginAPI, UserAPI
urlpatterns =[
    path("register", RegistrationAPI.as_view()),
    path("login", LoginAPI.as_view()),
    path("user", UserAPI.as_view()),
    path("logout", LogoutAPI.as_view()),
]
```
auth/register 로 접근 시 -> **301 에러**  
auth/register/ 로 접근 시 -> **정상 접속**  
\
(2)에서 301 Moved Permanently 에러가 나는 이유는 장고가 자체적으로 / 가 없는 주소를 / 가 있는 주소로 리다이렉트 하면서 발생하는 것입니다.

결론적으로, / 를 붙이는 것은 하나로 통일하여 미연에 에러를 방지하는 것이 좋습니다.

## 4. DRF + Heroku static 설정 오류

DRF를 Heroku에 올린 후 따로 설정을 하지 않으면 이미지나 CSS 같은 static 파일에 오류가 생겨 페이지가 제대로 뜨지 않습니다. 이때 다음과 같은 설정을 해줍시다.

**setings.py**
```py
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
```

그리고 한 가지 더 중요한 점은 다음과 같은 명령어를 쳐주는 것입니다.

```py
python manage.py collectstatic
```
여기서 만약 오류가 난다면, **staticfiles** 이나 **static** 폴더를 미리 만들어 놓고 다시 한번 명령어를 쳐보면 됩니다.

## 5. DRF media file serving 오류

DRF에서 media 파일을 저장/서빙하기 위해서는 다음과 같이 설정해줍니다.

**setings.py**
```py
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```
**urls.py**
```py
urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('', include(router.urls)),
    path('auth/', include('accounts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```
하지만 위의 설정만 하면 파일이 저장은 되지만 서빙이 되지 않습니다.

답은 간단합니다. 디버그 모드를 켜주면 됩니다.
~~이거 하나 때문에....~~

**setings.py**
```py
DEBUG = True
```

단, 추후 제대로 웹사이트를 운영하기 위해서는 디버그가 끝난 후 제대로 빌드해서 파일을 적용시켜줘야 합니다.

## Source

- 깃허브 프로젝트 주소  
  [https://github.com/Yanghyeondong/web_Guntor-Guntee_EarlyFried](https://github.com/Yanghyeondong/web_Guntor-Guntee_EarlyFried)