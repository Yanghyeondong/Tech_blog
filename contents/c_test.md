---
date: '2024-03-21'
title: 'C++ 실전 압축 정리본'
categories: ['Tip','C++', 'Algorithm']
summary: '코딩테스트에 유용한 C++ STL과 문법을 정리합니다.'
thumbnail: './common/c.png'
---

최근 삼성SDS SW검정 Pro를 취득하기위해 C++를 오랜만에 복기했습니다.  
평소 코딩테스트는 Python에만 익숙해지다 보니 생각보다 많은 부분에서 기억이 삭제되었습니다😫.  
그래서 알고리즘 특강동안 틈틈이 C++ 정리본을 작성하였고, 다음과 같이 공유합니다.  
특히 STL의 경우, [바킹독](https://github.com/encrypted-def/basic-algo-lecture)님의 글을 많이 참고했습니다! 대단하신 분입니다 😁.  
\
SDS 알고리즘 특강에서 배웠던 인덱스트리 등의 개념도 정리되어 있습니다!  

### 코드

```c
#include <iostream>
#include <string>
#include <vector>
#include <list> 
#include <stack>
#include <queue>
#include <deque>
#include <algorithm>
#include <limits>
#include <hash_map>
#include <unordered_map>
#include <unordered_set>
#include <unordered_multiset>

using namespace std;

// cin cout 사용시
ios::sync_with_stdio(0);
cin.tie(0);
cout.tie(0);

// vector 사용시
vector<int> v1(3, 5); // {5,5,5}; // 초기화 간단하게 하는법!
cout << v1.size() << '\n'; // 3
v1.push_back(7); // {5,5,5,7};
v4.pop_back();
v4.clear();

vector<int> v2(2); // {0,0};
v2.insert(v2.begin()+1, 3); // {0,3,0};

vector<int> v3 = {1,2,3,4}; // {1,2,3,4}
v3.erase(v3.begin()+2); // {1,2,4};

vector<int> v4; // {}
v4 = v3; //  복제된다
for (int e : v1) cout << e << ' ';
for (int& e : v1) cout << e << ' ';
for (int i=0; i<v1.size(); i++) cout << v[i] << ' ';

// 배열
fill(&t[0][0], &t[n][n+1], 0);

// 레퍼런스
int value = 5;
int& ref = value;
ref = 7;   // value is now 7

int change_val(int &p) {
  p = 3;
  return 0;
}
int main() {
  int number = 5;
  change_val(number);
  std::cout << number << std::endl; // number = 3
  
}
// 리스트
list<int> L = {1,2}; // 1 2
list<int>::iterator t = L.begin(); // t는 1을 가리키는 중
auto t = L.begin();
L.push_front(10); // 10 1 2
cout << *t << '\n'; // t가 가리키는 값 = 1을 출력
L.push_back(5); // 10 1 2 5
L.insert(t, 6); // t가 가리키는 곳 앞에 6을 삽입, 10 6 1 2 5
t++; // t를 1칸 앞으로 전진, 현재 t가 가리키는 값은 2
t = L.erase(t); // t가 가리키는 값을 제거, 그 다음 원소인 5의 위치를 반환
// 10 6 1 5, t가 가리키는 값은 5
cout << *t << '\n'; // 5
for(auto i : L) cout << i << ' ';
cout << '\n';
for(list<int>::iterator it = L.begin(); it != L.end(); it++)
cout << *it << ' ';

// 스택
stack<int> S;
S.push(10); // 10
S.push(20); // 10 20
S.push(30); // 10 20 30
cout << S.size() << '\n'; // 3
if(S.empty()) cout << "S is empty\n";
else cout << "S is not empty\n"; // S is not empty
S.pop(); // 10 20
cout << S.top() << '\n'; // 20
S.pop(); // 10
cout << S.top() << '\n'; // 10
S.pop(); // empty
if(S.empty()) cout << "S is empty\n"; // S is empty
cout << S.top() << '\n'; // runtime error 발생

// 큐
queue<int> Q;
Q.push(10); // 10
Q.push(20); // 10 20
Q.push(30); // 10 20 30
cout << Q.size() << '\n'; // 3
if(Q.empty()) cout << "Q is empty\n";
else cout << "Q is not empty\n"; // Q is not empty
Q.pop(); // 20 30
cout << Q.front() << '\n'; // 20
cout << Q.back() << '\n'; // 30
Q.push(40); // 20 30 40
Q.pop(); // 30 40
cout << Q.front() << '\n'; // 30

// 데크
deque<int> DQ;
DQ.push_front(10); // 10
DQ.push_back(50); // 10 50
DQ.push_front(24); // 24 10 50
for(auto x : DQ) cout << x << ' ';
cout << DQ.size() << '\n'; // 3
if(DQ.empty()) cout << "DQ is empty\n";
else cout << "DQ is not empty\n"; // DQ is not empty
DQ.pop_front(); // 10 50
DQ.pop_back(); // 10
cout << DQ.back() << '\n'; // 10
DQ.push_back(72); // 10 72
cout << DQ.front() << '\n'; // 10
DQ.push_back(12); // 10 72 12
DQ[2] = 17; // 10 72 17
DQ.insert(DQ.begin()+1, 33); // 10 33 72 17
DQ.insert(DQ.begin()+4, 60); // 10 33 72 17 60
for(auto x : DQ) cout << x << ' ';
cout << '\n';
DQ.erase(DQ.begin()+3); // 10 33 72 60
cout << DQ[3] << '\n'; // 60
DQ.clear(); // DQ의 모든 원소 제거

// pair tuple
pair <int, double> p1(1, 1.3);
v.push_back(make_pair(5, 6.3));



// dfs bfs 방향
int dx[] = {0,1,0,-1};
int dy[] = {1,0,-1,0};
for (int dir = 0; dir < 4; dir++) {
	int nx = x + dx[dir];
	int ny = y + dy[dir];
}

// sort or stable_sort
int arr[] = {3,1,4,1,5,9,2};
sort(arr, arr+7); //마지막 원소를 알려줘야 한다!

vector<int> b = {1, 4, 5, 2};
sort(b.begin(), b.end()};

// 비교함수는 우선순위가 같을때는 반드시 false를 반환해야 한다.
boot cmp(int a, int b){
	if (a>b) return true;
	return false;
}
boot cmp(int a, int b){
	return a > b;
}
sort(b.begin(), b.end(), cmp};

// 해시
unordered_set<int> s;
s.insert(-10); s.insert(100); s.insert(15); // {-10, 100, 15}
s.insert(-10); // {-10, 100, 15}    
cout << s.erase(100) << '\n'; // {-10, 15}, 1
cout << s.erase(20) << '\n'; // {-10, 15}, 0
if(s.find(15) != s.end()) cout << "15 in s\n";
else cout << "15 not in s\n";
cout << s.size() << '\n'; // 2
cout << s.count(50) << '\n'; // 0
for(auto e : s) cout << e << ' ';
cout << '\n';


unordered_multiset<int> ms;
ms.insert(-10); ms.insert(100); ms.insert(15); // {-10, 100, 15}
ms.insert(-10); ms.insert(15);// {-10, -10, 100, 15, 15}
cout << ms.size() << '\n'; // 5
for(auto e : ms) cout << e << ' ';
cout << '\n';
// 다 지워 버린다
cout << ms.erase(15) << '\n'; // {-10, -10, 100}, 2
// 하나만 지우고 싶을때
ms.erase(ms.find(-10)); // {-10, 100}
ms.insert(100); // {-10, 100, 100}
cout << ms.count(100) << '\n'; // 2


unordered_map<string, int> m;
m["hi"] = 123;
m["bkd"] = 1000;
m["gogo"] = 165; // ("hi", 123), ("bkd", 1000), ("gogo", 165)
cout << m.size() << '\n'; // 3
m["hi"] = -7;  // ("hi", -7), ("bkd", 1000), ("gogo", 165)
if(m.find("hi") != m.end()) cout << "hi in m\n";
else cout << "hi not in m\n";
m.erase("bkd"); // ("hi", 123), ("gogo", 165)
for(auto e : m)
cout << e.first << ' ' << e.second << '\n';

// binary search
vector<int> a = { 1, 2, 3 };
binary_search(v.begin(), v.end(), 1);
lower_bound(vec.begin(), vec.end(), 7); // 이상. 초과는 upper_bound

// 힙
priority_queue<int> pq; // 최대 힙
// priority_queue<int, vector<int>, greater<int>>로 선언시 최소 힙
pq.push(10); pq.push(2); pq.push(5); pq.push(9); // {10, 2, 5, 9}
cout << pq.top() << '\n'; // 10
pq.pop(); // {2, 5, 9}
cout << pq.size() << '\n'; // 3
if(pq.empty()) cout << "PQ is empty\n";
else cout << "PQ is not empty\n";
pq.pop(); // {2, 5}
cout << pq.top() << '\n'; // 5  
pq.push(5); pq.push(15); // {2, 5, 5, 15}
cout << pq.top() << '\n'; // 15


// 이진 검색 트리
set<int> s;
s.insert(-10); s.insert(100); s.insert(15); // {-10, 15, 100}
s.insert(-10); // {-10, 15, 100}
cout << s.erase(100) << '\n'; // {-10, 15}, 1
cout << s.erase(20) << '\n'; // {-10, 15}, 0
if(s.find(15) != s.end()) cout << "15 in s\n";
else cout << "15 not in s\n";
cout << s.size() << '\n'; // 2
cout << s.count(50) << '\n'; // 0
for(auto e : s) cout << e << ' ';
cout << '\n';
s.insert(-40); // {-40, -10, 15}
set<int>::iterator it1 = s.begin(); // {-40(<-it1), -10, 15}
it1++; // {-40, -10(<-it1), 15}
auto it2 = prev(it1); // {-40(<-it2), -10, 15}
it2 = next(it1); // {-40, -10, 15(<-it2)}
advance(it2, -2); // {-40(<-it2), -10, 15}
auto it3 = s.lower_bound(-20); // {-40, -10(<-it3), 15}
// 여기서 최대를 찾을려면 앞으로 한칸 가면 된다. prev(it1); it1--;
auto it4 = s.find(15); // {-40, -10, 15(<-it4)}
cout << *it1 << '\n'; // -10
cout << *it2 << '\n'; // -40
cout << *it3 << '\n'; // -10
cout << *it4 << '\n'; // 15


multiset<int> ms;
// {-10, 15, 100}
ms.insert(-10); ms.insert(100); ms.insert(15); // {-10, -10, 15, 15, 100}  
ms.insert(-10); ms.insert(15);
cout << ms.size() << '\n'; // 5
for(auto e : ms) cout << e << ' ';
cout << '\n';
cout << ms.erase(15) << '\n'; // {-10, -10, 100}, 2
ms.erase(ms.find(-10)); // {-10, 100}
ms.insert(100); // {-10, 100, 100}
cout << ms.count(100) << '\n'; // 2
auto it1 = ms.begin(); // {-10(<-it1), 100, 100}
auto it2 = ms.upper_bound(100); // {-10, 100, 100} (<-it2)
auto it3 = ms.find(100); // {-10, 100(<-it3), 100}
cout << *it1 << '\n'; // -10
cout << (it2 == ms.end()) << '\n'; // 1
cout << *it3 << '\n'; // 100


map<string, int> m;
m["hi"] = 123;
m["bkd"] = 1000;
m["gogo"] = 165; // ("bkd", 1000), ("gogo", 165), ("hi", 123)
cout << m.size() << '\n'; // 3
m["hi"] = -7;  // ("bkd", 1000), ("gogo", 165), ("hi", -7)
if(m.find("hi") != m.end()) cout << "hi in m\n";
else cout << "hi not in m\n";
m.erase("bkd"); // ("gogo", 165), ("hi", 123)
for(auto e : m)
cout << e.first << ' ' << e.second << '\n';
auto it1 = m.find("gogo");
cout << it1->first << ' ' << it1->second << '\n'; // gogo 165

// 수의 변경이 빈번하고, 그 와중에 쿼리가 있을때 -> 인덱스 트리
// indext tree 코드 스니펫

#include <vector>

using namespace std;

class IndexTree {
	long long leafleft;
	long long treesize;
	vector<long long> tree;

// 넣어줘야 접근 가능
public:
	IndexTree(long long n) {
		// leafLeft = 실제 leafnode가 채워지기 시작할 자리
		// leafnode의 최대 갯수는 n
		// 2의 배수로 증가해야 함
		for (leafleft = 1; leafleft < n; leafleft *= 2);
		// 뒤에 n개가 leaf node. 앞에 n개는 부모용
		treesize = leafleft * 2;
		// 0으로 초기화 된다.
		tree.resize(treesize);
	}
	long long logic(long long num1, long long num2)
	{
		// TODO : set logic
		return num1 + num2;
	}
	void update_tree(long long index)
	{
		// 0번에 도달하면 더이상 바꿀 부모가 없으므로 종료한다.
		if (index == 0) return;
		// 업데이트할 부모 노드의 인덱스는 자식 2개에 logic을 적용한것과 같다.
		tree[index] = logic(tree[2 * index], tree[2 * index + 1]);
		// 이거를 다시 부모에서 반복한다.
		update_tree(index / 2);
	}
	void update(long long order, long long data)
	{
		// cout << "update: " << order << " th -> " << "data: " << data << "\n";
		// 앞에서 order(몇번째 순서)의 leafnode의 데이터를 바꾸려고 한다
		long long index = leafleft + order - 1;
		tree[index] = data;
		// 부모를 다시 다 바꿔줘야 한다.
		update_tree(index / 2);
	}
	void print_tree() {
		cout << "tree = ";
		for (long long i = 0; i < treesize; i++) {
			cout << tree[i] << " ";
		}
		cout << "\n";
	}
	long long query(long long begin, long long end)
	{
		// 찾을려고 하는 leafnode 범위의 시작 L과 끝 R을 정한다
		// begin은 1부터 시작.
		long long L = leafleft + begin - 1;
		long long R = leafleft + end - 1;
		// cout << "query: " << L << "  -> " << R << "\n";
		// 기본 반환값 설정
		long long result = 0;

		// 교차되면 종료
		while (L < R)
		{
			// L이 left child 라면 자신의 부모로 가고, 
			// right child 라면 자신 오른쪽의 부모로 간다.
			// R이 right child 라면 자신의 부모로 가고,
			// left child 라면 자신 왼쪽의 부모로 간다.
			long long nextL = (L + 1) / 2;
			long long nextR = (R - 1) / 2;

			// L이 left child가 아니라면 현재 자신의 부모는 못쓰므로 
			// 버리고 자신만 result에 누적한다.
			if (nextL != L / 2)
				result = logic(result, tree[L]);

			// R이 right child가 아니라면 현재 자신의 부모는 못쓰므로 
			// 버리고 자신만 result에 누적한다.
			if (nextR != R / 2)
				result = logic(result, tree[R]);

			// 그리고 나서 다음 부모 범위로 좁혀간다.
			L = nextL;
			R = nextR;
		}
		// 만약 부모가 동일하다면 (끝났다면), 그 결과를 지금까지와 합쳐서 반환. 
		if (L == R)
			result = logic(result, tree[L]);
		return result;
	}
};

IndexTree indextree = IndexTree(1000000);
```

## Source

- 『basic-algo-lecture』 *바킹독 - 지음*  
  [https://github.com/encrypted-def/basic-algo-lecture](https://github.com/encrypted-def/basic-algo-lecture)
