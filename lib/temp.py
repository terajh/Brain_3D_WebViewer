import os
path = '/home/crescom/문서/bone_classification_slim01/data/6carpal/val' + '/'
folder = os.listdir(path)
for one_folder in folder:
   img_list_path = path + one_folder
   img_list = os.listdir(img_list_path)
   for one_img_list in img_list:
       if 'nor' in one_img_list:
           remove_img = img_list_path + '/' + one_img_list
           os.remove(remove_img)