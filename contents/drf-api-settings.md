---
date: '2021-10-05'
title: '[velog 이전] DRF API 설정 3종 세트 read_only + required + permission'
categories: ['Web', 'Back-end']
summary: 'DRF API 설정 중 read_only, required, permission에 대해서 알아본다'
thumbnail: './drf-api-settings/main.jpg'
---
*해당 글은 과거 **velog**에 쓴 글을 다듬어서 이전한 글입니다. 원본은 [**링크**](https://velog.io/@hdyang0686/DRF-API-%EC%84%A4%EC%A0%95-3%EC%A2%85-%EC%84%B8%ED%8A%B8-readonlyrequiredpermission)를 참조하시기 바랍니다.*  
\
이번 국방부 해커톤 대회를 진행하며 **Django**를 다루게 되었는데, 그 과정 중 모델의 요청이나 변경 권한을 두고 여러 공부를 하였습니다. 그중 자주 쓰이는 **readonly, required, permission** 3개의 설정에 대해 정리해보았습니다.

## 1. read_only
DRF의 Serializer fields 중 read_only 설정에 대한 공식 홈페이지의 설명은 다음과 같습니다.
> Read-only fields are included in the API output, but **should not be included in the input during create or update operations**. Any 'read_only' fields that are incorrectly included in the serializer input will be ignored.

간단하게 정리하면, 사용자가 POST 나 PUT을 할 때는 요청에 포함되지 않고 GET 등을 할 때는 보이는 정보입니다. 이는 당연히 사용자가 마음대로 변경해서는 안 되는, 서버에서만 관리하는 정보를 다룰 때 사용합니다. 다음은 예시입니다.

```py
UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields='__all__'
        read_only_fields = ['experience_point']
```
위의 코드는 유저에 대한 정보를 나타내 주는 user_serializer 파일입니다.
여기서 `read_only_fields = ['experience_point' ]`에 해당하는 부분을 생각해봅시다. 유저의 경험치를 유저 스스로 바꿀 수 있다면 대참사가 일어날 것입니다. 그러니 서버에서 read_only를 통해 미리 예방해주는 것이 올바른 방법입니다.

## 2. required
required는 서버에서 꼭 필요로 하는 정보나 그렇지 않은 정보를 구분하는 것입니다. 
> Normally an error will be raised if a field is not supplied during deserialization. Set to false if this field is **not required to be present during deserialization**.

다음은 예시입니다.
```py
UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields='__all__'
        extra_kwargs = {'profile_image': {'required': False}} 
```
보통 페이스북이나 카카오톡에서 사진을 등록하지 않으면 기본 프로필 사진이 뜹니다. 이때 프로필 사진은 유저의 활동에 꼭 필요한 파일이 아님을 알 수 있습니다. 이는 `'required': False` 옵션을 통해 받는 Json 파일에서 제외시킬 수 있습니다. 이때 **extra_kwargs** 항목은 여러 필드의 required 항목을 각각 편집할 수 있게 해주는 아주 편리한 기능입니다 :)

## 3. permission
![1](./drf-api-settings/1.png)  
\
permission은 말 그대로 권한을 설정하는 것입니다. DRF의 경우 **rest_framework.permissions** 에서 다양한 형태의 권한 설정을 들고 올 수 있습니다. 예를 들어 **AllowAny**는 모두에게 기능이 열려있는 경우입니다. 만약 다음과 같이 회원가입을 하는 경우를 가정해봅시다.
  
```py
class RegistrationAPI(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        ...
```
만약 권한이 있는 사람만이 회원가입이 가능하다면 이는 모순이 되어버립니다. 따라서 회원가입은 모두에게 열려있어야 하므로, **AllowAny**를 써야 합니다.

**IsAuthenticated**의 경우, 권한이 있는 사람만이 해당 기능에 접근할 수 있습니다. 예를 들어 계정을 로그아웃하는 기능은 그 계정을 가진, 권한이 있는 사람만이 가능할 것이죠. 이때 권한의 확인은 주로 토큰을 사용하게 됩니다.
```py
class LogoutAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        ...
```
**IsAuthenticatedOrReadOnly**의 경우, GET 같은 읽기만 하는 기능은 권한이 필요 없지만, POST 나 PUT 같이 수정을 하는 기능은 권한이 필요합니다. 예를 들어 질문 게시판 앱을 만들었다고 생각해봅시다. 외부인도 질문과 답변은 다 확인할 수 있지만 질문의 작성과 수정은 가입자, 즉 권한이 있는 자만 가능해야 합니다. 이는 다음과 같이 코드로 설정할 수 있습니다.
```py
class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset=Question.objects.all()
    serializer_class=QuestionSerializer
```

## 마무리
이번 글에서 DRF를 배우며 자주 썼던 모델 설정 조합을 정리해보았습니다. 물론 쉬운 내용이지만, 처음으로 장고 앱을 만드는 사람에게는 좋은 이정표가 될 수 있기를 바랍니다.  

## Source

- 깃허브 프로젝트 주소  
  [https://github.com/Yanghyeondong/web_Guntor-Guntee_EarlyFried](https://github.com/Yanghyeondong/web_Guntor-Guntee_EarlyFried)