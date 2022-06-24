#include <iostream>
#include "funcs.h"
using namespace std;

int main()
{
	node* head = new node;
    node* second = new node;
    node* third = new node;

	head->value = 0;
	head->nxtadd = second;
	second->value = 1;
	second->nxtadd = third;
    third->value = 2;
	third->nxtadd = NULL;

	// reverselist(head);
	insert_middle(&second, 5);
	print(head);
	
    deleteobj(head);
    system("pause");
	return false;
    
}