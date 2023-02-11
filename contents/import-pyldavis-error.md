---
date: '2023-02-12'
title: "Colab import pyLDAvis No module named 'pyLDAvis' error"
categories: ['Colab','Python']
summary: "import pyLDAvis No module named 'pyLDAvis' 설치 에러 해결하기"
thumbnail: './common/colab.png'
---
## 1. 미리 보는 결론

다음과 같이 설치 & 실행하면 됩니다.  
중요한 점은 `--user` 같은 **옵션을 넣으면 안 되는 것**입니다. 만약 잘 되지 않는다면, 이전 런타임의 영향일 수도 있으니 **런타임 유형을 변경해 가며** (None -> GPU) 다시 해보는 것을 추천드립니다.   

```py
! pip install pyldavis

import pyLDAvis
```

## 2. 문제 확인

구글 코랩에서 다음과 같이 pyldavis를 설치하고 import를 하면 에러가 발생합니다.  
아무리 런타임을 재할당해도, 동일한 오류가 계속 발생합니다.  

```py
# error
! pip install --user pyldavis

import pyLDAvis
```

```py
Looking in indexes: https://pypi.org/simple, https://us-python.pkg.dev/colab-wheels/public/simple/
Collecting pyldavis
  Downloading pyLDAvis-3.3.1.tar.gz (1.7 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 1.7/1.7 MB 13.9 MB/s eta 0:00:00
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Installing backend dependencies ... done
  Preparing metadata (pyproject.toml) ... done
Requirement already satisfied: gensim in /usr/local/lib/python3.8/dist-packages (from pyldavis) (3.6.0)
Requirement already satisfied: numpy>=1.20.0 in /usr/local/lib/python3.8/dist-packages (from pyldavis) (1.21.6)
Requirement already satisfied: setuptools in /usr/local/lib/python3.8/dist-packages (from pyldavis) (57.4.0)
Collecting funcy
  Downloading funcy-1.18-py2.py3-none-any.whl (33 kB)
Collecting sklearn
  Downloading sklearn-0.0.post1.tar.gz (3.6 kB)
  Preparing metadata (setup.py) ... done
Requirement already satisfied: future in /usr/local/lib/python3.8/dist-packages (from pyldavis) (0.16.0)
Requirement already satisfied: scikit-learn in /usr/local/lib/python3.8/dist-packages (from pyldavis) (1.0.2)
Requirement already satisfied: joblib in /usr/local/lib/python3.8/dist-packages (from pyldavis) (1.2.0)
Requirement already satisfied: pandas>=1.2.0 in /usr/local/lib/python3.8/dist-packages (from pyldavis) (1.3.5)
Requirement already satisfied: scipy in /usr/local/lib/python3.8/dist-packages (from pyldavis) (1.7.3)
Requirement already satisfied: numexpr in /usr/local/lib/python3.8/dist-packages (from pyldavis) (2.8.4)
Requirement already satisfied: jinja2 in /usr/local/lib/python3.8/dist-packages (from pyldavis) (2.11.3)
Requirement already satisfied: python-dateutil>=2.7.3 in /usr/local/lib/python3.8/dist-packages (from pandas>=1.2.0->pyldavis) (2.8.2)
Requirement already satisfied: pytz>=2017.3 in /usr/local/lib/python3.8/dist-packages (from pandas>=1.2.0->pyldavis) (2022.7.1)
Requirement already satisfied: smart-open>=1.2.1 in /usr/local/lib/python3.8/dist-packages (from gensim->pyldavis) (6.3.0)
Requirement already satisfied: six>=1.5.0 in /usr/local/lib/python3.8/dist-packages (from gensim->pyldavis) (1.15.0)
Requirement already satisfied: MarkupSafe>=0.23 in /usr/local/lib/python3.8/dist-packages (from jinja2->pyldavis) (2.0.1)
Requirement already satisfied: threadpoolctl>=2.0.0 in /usr/local/lib/python3.8/dist-packages (from scikit-learn->pyldavis) (3.1.0)
Building wheels for collected packages: pyldavis, sklearn
  Building wheel for pyldavis (pyproject.toml) ... done
  Created wheel for pyldavis: filename=pyLDAvis-3.3.1-py2.py3-none-any.whl size=136898 sha256=ae4a9933fef32f7760f02e8ea6e0b9d64e1726f90cb5ad183c4086d8c835b2d4
  Stored in directory: /root/.cache/pip/wheels/90/61/ec/9dbe9efc3acf9c4e37ba70fbbcc3f3a0ebd121060aa593181a
  Building wheel for sklearn (setup.py) ... done
  Created wheel for sklearn: filename=sklearn-0.0.post1-py3-none-any.whl size=2344 sha256=6525a544615913c7ddc1a799d2e2bef757fa1e90977428c18b22f8cef6156955
  Stored in directory: /root/.cache/pip/wheels/14/25/f7/1cc0956978ae479e75140219088deb7a36f60459df242b1a72
Successfully built pyldavis sklearn
Installing collected packages: sklearn, funcy, pyldavis
Successfully installed funcy-1.18 pyldavis-3.3.1 sklearn-0.0.post1
---------------------------------------------------------------------------
ModuleNotFoundError                       Traceback (most recent call last)
<ipython-input-1-4099bfb9d4a0> in <module>
      1 get_ipython().system(' pip install --user pyldavis')
      2 
----> 3 import pyLDAvis
      4 import pyLDAvis.sklearn

ModuleNotFoundError: No module named 'pyLDAvis'

---------------------------------------------------------------------------
NOTE: If your import is failing due to a missing package, you can
manually install dependencies using either !pip or !apt.

To view examples of installing some common dependencies, click the
```

이때 다음과 같이 설치해 주면 쉽게 해결이 가능합니다.  

```py
! pip install pyldavis

import pyLDAvis
```

아마 `--user` 옵션이 PATH에 영향을 주어서 그런 것 같습니다. 다만, 런타임마다 결과가 달라서 좀 더 다양한 원인이 있는 듯합니다.   