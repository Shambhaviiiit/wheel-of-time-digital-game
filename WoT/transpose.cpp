#include<bits/stdc++.h>
using namespace std;
void reverseAndAppend(vector<vector<int>>& data)
{
    
}
int main() 
{
    vector<vector<int>> data = 
    { 
          {10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10},
          {10,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10},
          {10,12,1,13,13,13,13,1,1,10,10,1,1,13,13,13,13,1,12,10,},
          {10,1,1,13,1,1,1,1,12,10,10,12,1,1,1,1,13,1,1,10},
          {10,12,1,1,1,11,11,1,1,10,10,1,1,11,11,1,1,1,12,10},
          {10,10,10,1,1,1,11,1,13,10,10,13,1,11,1,1,1,10,10,10},
          {10,2,2,2,12,1,1,1,1,10,10,1,1,1,1,12,2,2,2,10},
          {10,2,10,2,2,1,13,13,1,10,10,1,13,13,1,2,2,10,2,10},
          {10,2,10,2,12,1,1,13,1,10,10,1,13,1,1,12,2,10,2,10},
          {10,2,2,2,2,1,1,1,1,10,10,1,1,1,1,2,2,2,2,10},
          {10,10,10,2,12,1,1,13,13,10,10,13,13,1,1,12,2,10,10,10},
          {10,2,2,2,2,1,1,1,1,10,10,1,1,1,1,2,2,2,2,10},
          {10,2,2,2,2,13,13,1,1,10,10,1,1,13,13,2,2,2,2,10},
          {10,10,10,10,10,10,10,10,1,1,1,1,10,10,10,10,10,10,10,10},
          {10,10,10,10,10,10,10,10,1,1,1,1,10,10,10,10,10,10,10,10},
          {10,2,2,2,2,13,13,1,1,10,10,1,1,13,13,2,2,2,2,10},
          {10,2,2,2,2,1,1,1,1,10,10,1,1,1,1,2,2,2,2,10},
          {10,10,10,2,12,1,1,13,13,10,10,13,13,1,1,12,2,10,10,10},
          {10,2,2,2,2,1,1,1,1,10,10,1,1,1,1,2,2,2,2,10},
          {10,2,10,2,12,1,1,13,1,10,10,1,13,1,1,12,2,10,2,10},
          {10,2,10,2,2,1,13,13,1,10,10,1,13,13,1,2,2,10,2,10},
          {10,2,2,2,12,1,1,1,1,10,10,1,1,1,1,12,2,2,2,10},
          {10,10,10,1,1,1,11,1,13,10,10,13,1,11,1,1,1,10,10,10},
          {10,12,1,1,1,11,11,1,1,10,10,1,1,11,11,1,1,1,12,10},
          {10,1,1,13,1,1,1,1,12,10,10,12,1,1,1,1,13,1,1,10},
          {10,12,1,13,13,13,13,1,1,10,10,1,1,13,13,13,13,1,12,10},
          {10,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10},
          {10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10},
        };
    int i,j,m = data.size(),n=data[0].size();
    vector<vector<int>> sol(n,vector<int>(m));
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            sol[j][i] = data[i][j];
        }
    }
    cout<<"["<<"\n";
    for (const auto& array : sol)
    {
        cout<<"[";
        for (int value : array) {
            cout << value << ",";
        }
        cout <<"],"<<"\n";
    }
    cout<<"],"<<"\n";

    return 0;
}