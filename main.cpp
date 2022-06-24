#include <iostream>
#include "funcs.h"
using namespace std;

int main()
{
	node* head = new node;
    node* second = new node;
    node* third = new node;

	head->value = 0;
	head->nexadd = second;
	second->value = 1;
	second->nexadd = third;
    third->value = 2;
	third->nexadd = NULL;

	reverselist(head);

	print(head);
	/* print(head);
    reverselist(head);
	print(head); */
	
    deleteobj(head);
    system("pause");
	return false;
    
}

