#include <iostream>
#include "funcs.h"

using namespace std;


void deleteobj(node* x) {
	delete x;
	x = NULL;
}

void insert_front(node** x, int value) {
	node* temp = new node;
	temp->value = value;
	temp->nexadd = *x;
	*x = temp;
}

void print(node* x) {
	while (x != NULL)
	{
		cout << x->value << endl;
		x = x->nexadd;
	}
}

void insert_back(node** x, int value){
    node* temp = new node;
    temp->value = value;
    temp->nexadd = NULL;

    if(*x == NULL){
        *x = temp;
        return;
    }

    node* temp2 = *x;
    while (temp2->nexadd != NULL)
    {
        temp2 = temp2->nexadd;
    }
    
    temp2->nexadd = temp;
}

void insert_middle(node** q, int value){
    node* temp = new node;
    node* temp2 = *q;
    if(temp2->nexadd == NULL){
    temp->value = value;
    temp->nexadd = NULL;
    temp2->nexadd = temp;
    }

    else
    temp->value = value;
    temp->nexadd = temp2->nexadd;
    temp2->nexadd = temp;
}

void delete_node(node **v){
    node* temp = *v;
    node* temp2 = temp->nexadd;
    if(temp2->nexadd == NULL){
    delete temp2;
    temp2 = NULL;
    }
    else
    temp->nexadd = temp2->nexadd;
    delete temp2;
    temp2 = NULL;
}

node* reverselist(node* head){
    //base case
    if(head == NULL)
    return NULL;
    if(head->nexadd == NULL)
        return head;
    //recursive call
    node* temp = reverselist(head->nexadd);

    head->nexadd->nexadd = head;
    head->nexadd = NULL;
    return temp;
}