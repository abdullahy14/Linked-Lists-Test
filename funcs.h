#pragma once
#include <iostream>
using namespace std;

struct node {
    public:
	int value;
	node* nexadd;
};


void deleteobj(node*);
void insert_front(node**, int);
void print(node*);
void insert_back(node** , int );
void insert_middle(node** , int );
void delete_node(node **);
node* reverselist(node*);
