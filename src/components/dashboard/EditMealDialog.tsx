// src/components/EditMealDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Meal } from '@/app/(protected)/history/types';
import { ChevronDown } from 'lucide-react';

interface EditMealDialogProps {
  meal: Meal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMeal: Meal) => void;
}

export function EditMealDialog({ meal, isOpen, onClose, onSave }: EditMealDialogProps) {
  const [editedMeal, setEditedMeal] = useState<Meal>({...meal});
  const [macroExpanded, setMacroExpanded] = useState(false);
  const [microExpanded, setMicroExpanded] = useState(false);

  const handleSave = () => {
    onSave(editedMeal);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Description</label>
            <Input
              value={editedMeal.input_text}
              onChange={(e) => setEditedMeal({ ...editedMeal, input_text: e.target.value })}
              placeholder="Enter meal description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <Select
              value={editedMeal.meal_details.mealType || 'unspecified'}
              onValueChange={(value) => setEditedMeal({ ...editedMeal, meal_details: { ...editedMeal.meal_details, mealType: value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
            <Input
              type="number"
              value={editedMeal.meal_details.calories}
              onChange={(e) => setEditedMeal({ ...editedMeal, meal_details: { ...editedMeal.meal_details, calories: Number(e.target.value) } })}
              placeholder="Enter calories"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <Input
              value={editedMeal.meal_details.quantity}
              onChange={(e) => setEditedMeal({ ...editedMeal, meal_details: { ...editedMeal.meal_details, quantity: e.target.value } })}
              placeholder="Enter quantity (e.g., 1 serving, 200g)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
            <DatePicker
              selected={editedMeal.logged_at ? new Date(editedMeal.logged_at) : new Date()}
              onChange={(date: Date | null) => {
                if (date && !isNaN(date.getTime())) {
                  setEditedMeal({ ...editedMeal, logged_at: date.toISOString() })
                }
              }}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          <div>
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-50"
              onClick={() => setMacroExpanded(!macroExpanded)}
            >
              <span>Macronutrients</span>
              <ChevronDown
                className={`${
                  macroExpanded ? 'transform rotate-180' : ''
                } w-5 h-5 text-purple-500`}
              />
            </button>
            {macroExpanded && (
              <div className="mt-2 space-y-2">
                {['Protein', 'Carbs', 'Fat'].map((macro) => (
                  <div key={macro} className="flex items-center space-x-2">
                    <label className="w-1/3 text-sm font-medium text-gray-700">{macro}</label>
                    <Input
                      type="number"
                      value={editedMeal.meal_details.nutrients?.find((n) => n.name === macro)?.amount || 0}
                      onChange={(e) => {
                        const updatedNutrients = editedMeal.meal_details.nutrients?.map((n) =>
                          n.name === macro ? { ...n, amount: Number(e.target.value) } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          meal_details: {
                            ...editedMeal.meal_details,
                            nutrients: updatedNutrients
                          }
                        });
                      }}
                      placeholder={`Enter ${macro.toLowerCase()} amount`}
                      className="w-1/3"
                    />
                    <span className="w-1/3 text-sm text-gray-500">g</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-50"
              onClick={() => setMicroExpanded(!microExpanded)}
            >
              <span>Micronutrients</span>
              <ChevronDown
                className={`${
                  microExpanded ? 'transform rotate-180' : ''
                } w-5 h-5 text-purple-500`}
              />
            </button>
            {microExpanded && (
              <div className="mt-2 space-y-2">
                {editedMeal.meal_details.nutrients?.filter((n) => !['Protein', 'Carbs', 'Fat'].includes(n.name)).map((nutrient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={nutrient.name}
                      onChange={(e) => {
                        const updatedNutrients = editedMeal.meal_details.nutrients?.map((n, i) =>
                          i === index ? { ...n, name: e.target.value } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          meal_details: {
                            ...editedMeal.meal_details,
                            nutrients: updatedNutrients
                          }
                        });
                      }}
                      placeholder="Nutrient name"
                      className="w-1/3"
                    />
                    <Input
                      type="number"
                      value={nutrient.amount}
                      onChange={(e) => {
                        const updatedNutrients = editedMeal.meal_details.nutrients?.map((n, i) =>
                          i === index ? { ...n, amount: Number(e.target.value) } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          meal_details: {
                            ...editedMeal.meal_details,
                            nutrients: updatedNutrients
                          }
                        });
                      }}
                      placeholder="Amount"
                      className="w-1/3"
                    />
                    <Input
                      value={nutrient.unit}
                      onChange={(e) => {
                        const updatedNutrients = editedMeal.meal_details.nutrients?.map((n, i) =>
                          i === index ? { ...n, unit: e.target.value } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          meal_details: {
                            ...editedMeal.meal_details,
                            nutrients: updatedNutrients
                          }
                        });
                      }}
                      placeholder="Unit"
                      className="w-1/3"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newNutrients = [...(editedMeal.meal_details.nutrients || []), { name: '', amount: 0, unit: '' }];
                    setEditedMeal({
                      ...editedMeal,
                      meal_details: {
                        ...editedMeal.meal_details,
                        nutrients: newNutrients
                      }
                    });
                  }}
                  className="w-full"
                >
                  Add Micronutrient
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}