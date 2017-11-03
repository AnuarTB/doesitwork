#include <bits/stdc++.h>

using namespace std;

const string weekdays[] = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"};

int main(){
	freopen("input.txt", "r", stdin);
	string name, filename;
	cout << "Write title of the facility:\n";
	getline(cin, name);
	cout << "Write the name of file where the data will be written:\n";
	getline(cin, filename);
	cout << "Write down please the working hours during Mon-Fri\n";
	cout << "Write the working hours in the format by pairs of lines\n";
	cout << "Where the first line of pair represents the start of working hours\n";
	cout << "And the second line represents the finish of working hours\n";
	cout << "You can type several working hours time intervals\n";
	cout << "To cancel entering just type \"end\" on one line\n";
	vector <string> start[7], finish[7];
	string buffer;
	while(true){
		cin >> buffer;
		if(buffer == "end"){
			break;
		}
		start[0].push_back(buffer);
		cin >> buffer;
		finish[0].push_back(buffer);
	}
	cout << "Now type the data for Saturday in the same format:\n";
	while(true){
		cin >> buffer;
		if(buffer == "end"){
			break;
		}
		start[5].push_back(buffer);
		cin >> buffer;
		finish[5].push_back(buffer);
	}
	cout << "For the Sunday:\n";
	while(true){
		cin >> buffer;
		if(buffer == "end"){
			break;
		}
		start[6].push_back(buffer);
		cin >> buffer;
		finish[6].push_back(buffer);
	}
	for(int i = 1; i < 5; ++i){
		copy(start[0].begin(), start[0].end(), back_inserter(start[i]));
		copy(finish[0].begin(), finish[0].end(), back_inserter(finish[i]));
	}
	freopen(filename.c_str(), "w", stdout);
	cout << "{\n";
	cout << "\t\"title\": \"" + name + "\",\n";
	cout << "\t\"hours\": [";
	for(int i = 0; i < 7; ++i){
		if(i)
			cout << "\t";
		cout << "{\n";
		cout << "\t\t\"" + weekdays[i] + "\": [";
		for(int j = 0; j < start[i].size(); ++j){
			if(j) cout << "\t\t";
			cout << "{\n";
			cout << "\t\t\t\"start\": \"" + start[i][j] + "\",\n";
			cout << "\t\t\t\"finish\": \"" + finish[i][j] + "\"\n";
			cout << "\t\t}";
			if(j != start[i].size() - 1)
				cout << ",";
			cout << "\n";
		}
		cout << "\t\t]\n\t}";
		if(i != 6)
			cout << ",";
		cout << "\n"; 
	}
	cout << "\t]\n}";
	return 0;
}
