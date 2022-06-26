#include <iostream>
#include "funcs.h"
using namespace std;

int main()
{
	node* head = new node;
    node* second = new node;
    node* third = new node;

	node* head2 = new node;
    node* second2 = new node;
    node* third2 = new node;

	head->value = 0;
	head->nxtadd = second;
	second->value = 1;
	second->nxtadd = third;
    third->value = 4;
	third->nxtadd = NULL;

	head2->value = 3;
	head2->nxtadd = second2;
	second2->value = 7;
	second2->nxtadd = third2;
    third2->value = 9;
	third2->nxtadd = NULL;

	/* reverselist(head);
	insert_middle(&second, 5);
	insert_front(&head, 6);
	print(head); */
	
	// print(head2);
	print(merge_two_sorted_lists(head, head2));
	
    deleteobj(head);
    system("pause");
	return false;
    
}