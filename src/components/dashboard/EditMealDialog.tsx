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
  const [editedMeal, setEditedMeal] = useState<Meal>(meal);
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
              value={editedMeal.mealDetails.mealType}
              onValueChange={(value) => setEditedMeal({ ...editedMeal, mealDetails: { ...editedMeal.mealDetails, mealType: value } })}
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
              value={editedMeal.mealDetails.calories}
              onChange={(e) => setEditedMeal({ ...editedMeal, mealDetails: { ...editedMeal.mealDetails, calories: Number(e.target.value) } })}
              placeholder="Enter calories"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <Input
              value={editedMeal.mealDetails.quantity}
              onChange={(e) => setEditedMeal({ ...editedMeal, mealDetails: { ...editedMeal.mealDetails, quantity: e.target.value } })}
              placeholder="Enter quantity (e.g., 1 serving, 200g)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date and Time</label>
            <DatePicker
              selected={new Date(editedMeal.loggedAt)}
              onChange={(date: Date | null) => {
                if (date) {
                  setEditedMeal({ ...editedMeal, loggedAt: date.toISOString() })
                }
              }}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>
          
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMacroExpanded(!macroExpanded)}
              className="w-full justify-between"
            >
              Macronutrients
              <ChevronDown className={`h-4 w-4 transition-transform ${macroExpanded ? 'rotate-180' : ''}`} />
            </Button>
            {macroExpanded && (
              <div className="space-y-2 pl-4">
                {['Carbohydrates', 'Protein', 'Fat'].map((nutrient) => (
                  <div key={nutrient} className="flex items-center space-x-2">
                    <label className="w-1/3">{nutrient}</label>
                    <Input
                      type="number"
                      value={editedMeal.mealDetails.nutrients?.find(n => n.name === nutrient)?.amount || ''}
                      onChange={(e) => {
                        const updatedNutrients = editedMeal.mealDetails.nutrients?.map(n =>
                          n.name === nutrient ? { ...n, amount: Number(e.target.value) } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          mealDetails: {
                            ...editedMeal.mealDetails,
                            nutrients: updatedNutrients
                          }
                        });
                      }}
                      placeholder={`${nutrient} amount`}
                      className="w-1/3"
                    />
                    <Input
                      value={editedMeal.mealDetails.nutrients?.find(n => n.name === nutrient)?.unit || ''}
                      onChange={(e) => {
                        const updatedNutrients = editedMeal.mealDetails.nutrients?.map(n =>
                          n.name === nutrient ? { ...n, unit: e.target.value } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          mealDetails: {
                            ...editedMeal.mealDetails,
                            nutrients: updatedNutrients
                          }
                        });
                      }}
                      placeholder="Unit"
                      className="w-1/3"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMicroExpanded(!microExpanded)}
              className="w-full justify-between"
            >
              Micronutrients
              <ChevronDown className={`h-4 w-4 transition-transform ${microExpanded ? 'rotate-180' : ''}`} />
            </Button>
            {microExpanded && (
              <div className="space-y-2 pl-4">
                {editedMeal.mealDetails.nutrients?.filter(n => !['Carbohydrates', 'Protein', 'Fat'].includes(n.name)).map((nutrient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={nutrient.name}
                      onChange={(e) => {
                        const updatedNutrients = editedMeal.mealDetails.nutrients?.map((n, i) =>
                          i === index ? { ...n, name: e.target.value } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          mealDetails: {
                            ...editedMeal.mealDetails,
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
                        const updatedNutrients = editedMeal.mealDetails.nutrients?.map((n, i) =>
                          i === index ? { ...n, amount: Number(e.target.value) } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          mealDetails: {
                            ...editedMeal.mealDetails,
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
                        const updatedNutrients = editedMeal.mealDetails.nutrients?.map((n, i) =>
                          i === index ? { ...n, unit: e.target.value } : n
                        ) || [];
                        setEditedMeal({
                          ...editedMeal,
                          mealDetails: {
                            ...editedMeal.mealDetails,
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
                    const newNutrients = [...(editedMeal.mealDetails.nutrients || []), { name: '', amount: 0, unit: '' }];
                    setEditedMeal({
                      ...editedMeal,
                      mealDetails: {
                        ...editedMeal.mealDetails,
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