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
	temp->nxtadd = *x;
	*x = temp;
}

void print(node* x) {
	while (x != NULL)
	{
		cout << x->value << endl;
		x = x->nxtadd;
	}
}

void insert_back(node** x, int value){
    node* temp = new node;
    temp->value = value;
    temp->nxtadd = NULL;

    if(*x == NULL){
        *x = temp;
        return;
    }

    node* temp2 = *x;
    while (temp2->nxtadd != NULL)
    {
        temp2 = temp2->nxtadd;
    }
    
    temp2->nxtadd = temp;
}

void insert_middle(node** q, int value){
    node* temp = new node;
    node* temp2 = *q;
    if(temp2->nxtadd == NULL){
    temp->value = value;
    temp->nxtadd = NULL;
    temp2->nxtadd = temp;
    }

    else
    temp->value = value;
    temp->nxtadd = temp2->nxtadd;
    temp2->nxtadd = temp;
}

void delete_node(node **v){
    node* temp = *v;
    node* temp2 = temp->nxtadd;
    if(temp2->nxtadd == NULL){
    delete temp2;
    temp2 = NULL;
    }
    else
    temp->nxtadd = temp2->nxtadd;
    delete temp2;
    temp2 = NULL;
}

node* reverselist(node* head){
    //base case
    if(head == NULL)
    return NULL;
    if(head->nxtadd == NULL)
        return head;
    //recursive call
    node* temp = reverselist(head->nxtadd);

    head->nxtadd->nxtadd = head;
    head->nxtadd = NULL;
    return temp;
}